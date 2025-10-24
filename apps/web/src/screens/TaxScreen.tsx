import React, { useState } from "react";
import { GoogleGenAI } from "@google/genai";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { MOCK_TAX_ASSETS, MOCK_TAX_INCOMES } from "../constants";
import type { TaxAsset, TaxIncome, UserRole } from "../types";
import { AlertTriangleIcon, PlusIcon, SparklesIcon } from "@/components/assets/Icons";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/Tabs";
import Spinner from "@/components/ui/Spinner";

const formatBRL = (value: number) => {
    return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
};

const TaxAssetRow: React.FC<{ asset: TaxAsset }> = ({ asset }) => (
    <tr className="border-b border-outline last:border-b-0 hover:bg-surface-variant/5">
        <td className="p-3 text-on-surface-variant">
            {asset.groupCode}.{asset.itemCode}
        </td>
        <td className="p-3 font-medium text-on-surface">{asset.itemName}</td>
        <td className="p-3 text-on-surface-variant text-xs max-w-sm">{asset.description}</td>
        <td className="p-3 text-right font-mono text-on-surface-variant">{formatBRL(asset.value2023)}</td>
        <td className="p-3 text-right font-mono font-medium text-on-surface">{formatBRL(asset.value2024)}</td>
    </tr>
);

const TaxIncomeRow: React.FC<{ income: TaxIncome }> = ({ income }) => (
    <tr className="border-b border-outline last:border-b-0 hover:bg-surface-variant/5">
        <td className="p-3 text-on-surface-variant">{income.code}</td>
        <td className="p-3 font-medium text-on-surface max-w-xs">{income.description}</td>
        <td className="p-3 text-on-surface-variant text-xs">
            {income.sourceName}
            <br />
            {income.sourceCnpj}
        </td>
        <td className="p-3 text-right font-mono font-medium text-on-surface">{formatBRL(income.value)}</td>
    </tr>
);

const MarkdownRenderer: React.FC<{ content: string }> = ({ content }) => {
    const lines = content.split("\n");
    return (
        <div className="prose prose-sm max-w-none text-on-surface-variant">
            {lines.map((line, index) => {
                // Handle headings
                if (line.startsWith("## ")) {
                    return (
                        <h2 key={index} className="text-lg font-medium text-on-surface mt-4 mb-2">
                            {line.substring(3)}
                        </h2>
                    );
                }
                // Handle list items, including bold text within them
                if (line.startsWith("* ")) {
                    const lineContent = line.substring(2);
                    const parts = lineContent.split("**");
                    const renderedLine = parts.map((part, i) =>
                        i % 2 === 1 ? (
                            <strong key={i} className="font-medium text-on-surface">
                                {part}
                            </strong>
                        ) : (
                            part
                        )
                    );
                    return (
                        <li key={index} className="ml-4 list-disc">
                            {renderedLine}
                        </li>
                    );
                }
                if (line.trim() === "") {
                    return <br key={index} />;
                }
                // Handle bold text in paragraphs
                const parts = line.split("**");
                const renderedLine = parts.map((part, i) =>
                    i % 2 === 1 ? (
                        <strong key={i} className="font-medium text-on-surface">
                            {part}
                        </strong>
                    ) : (
                        part
                    )
                );

                return (
                    <p key={index} className="mb-2">
                        {renderedLine}
                    </p>
                );
            })}
        </div>
    );
};

interface TaxScreenProps {
    userRole: UserRole;
    onUpgrade: () => void;
    onShowToast: (message: string, type: "success" | "error") => void;
}

const TaxScreen: React.FC<TaxScreenProps> = ({ userRole, onUpgrade, onShowToast }) => {
    const [assets] = useState<TaxAsset[]>(MOCK_TAX_ASSETS);
    const [exemptIncomes] = useState<TaxIncome[]>(MOCK_TAX_INCOMES.filter((i) => i.type === "EXEMPT"));
    const [exclusiveIncomes] = useState<TaxIncome[]>(MOCK_TAX_INCOMES.filter((i) => i.type === "EXCLUSIVE"));

    const [aiSummary, setAiSummary] = useState<string | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);

    if (userRole === "FREE") {
        return (
            <div className="p-4 md:p-8 text-center flex flex-col items-center justify-center h-full">
                <div className="bg-tertiary/20 p-3 rounded-full mb-4">
                    <AlertTriangleIcon className="w-8 h-8 text-tertiary" />
                </div>
                <h2 className="text-2xl font-medium text-on-surface mb-2">Simplify Your Tax Season</h2>
                <p className="text-on-surface-variant max-w-md mb-6">
                    Upgrade to Premium to get your IRPF report automatically generated from your connected accounts and
                    investments.
                </p>
                <Button onClick={onUpgrade}>Upgrade to Premium</Button>
            </div>
        );
    }

    const patrimonio2023 = assets.reduce((sum, asset) => sum + asset.value2023, 0);
    const patrimonio2024 = assets.reduce((sum, asset) => sum + asset.value2024, 0);
    const evolucaoPatrimonial = patrimonio2024 - patrimonio2023;

    const handleGenerateSummary = async () => {
        setIsGenerating(true);
        setAiSummary(null);

        const prompt = `
        Você é um especialista em imposto de renda brasileiro. Com base nos dados JSON de bens, direitos e rendimentos de um usuário, gere um resumo amigável e informativo da declaração de IRPF dele.

        O resumo deve ser em português do Brasil e formatado em Markdown.

        O resumo deve incluir:
        - Uma saudação inicial.
        - Um resumo do patrimônio total em 2024 e a evolução em relação a 2023.
        - Destaques sobre os principais bens declarados (ex: poupança, fundos).
        - Um resumo dos rendimentos, separando os isentos dos de tributação exclusiva.
        - Uma conclusão amigável com um lembrete de que isso é um resumo gerado por IA e não substitui a consulta a um profissional.

        Use títulos (##), listas (*) e negrito (**) para formatar a resposta.

        Aqui estão os dados do usuário:

        Bens e Direitos:
        ${JSON.stringify(assets, null, 2)}

        Rendimentos Isentos e Não Tributáveis:
        ${JSON.stringify(exemptIncomes, null, 2)}

        Rendimentos Sujeitos à Tributação Exclusiva/Definitiva:
        ${JSON.stringify(exclusiveIncomes, null, 2)}
    `;

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: prompt,
            });

            setAiSummary(response.text);
        } catch (error) {
            console.error("Error generating AI summary:", error);
            onShowToast("Failed to generate AI summary. Please try again.", "error");
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="p-4 md:p-8">
            <header className="flex justify-between items-start mb-6">
                <div>
                    <h1 className="text-3xl font-normal text-on-surface">Income Tax (IRPF) 2025</h1>
                    <p className="text-base text-on-surface-variant">
                        Ano-calendário 2024. Prepare sua declaração com dados pré-compilados.
                    </p>
                </div>
                <Button
                    onClick={handleGenerateSummary}
                    disabled={isGenerating}
                    leftIcon={<SparklesIcon className="w-5 h-5" />}
                >
                    {isGenerating ? "Generating..." : "Generate AI Summary"}
                </Button>
            </header>
            <main className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="p-4">
                        <p className="text-sm text-on-surface-variant">Imposto a Restituir (est.)</p>
                        <p className="text-2xl font-medium text-secondary">{formatBRL(8500)}</p>
                    </Card>
                    <Card className="p-4">
                        <p className="text-sm text-on-surface-variant">Imposto a Pagar (est.)</p>
                        <p className="text-2xl font-medium text-on-surface">{formatBRL(0)}</p>
                    </Card>
                    <Card className="p-4">
                        <p className="text-sm text-on-surface-variant">Evolução Patrimonial</p>
                        <p
                            className={`text-2xl font-medium ${
                                evolucaoPatrimonial >= 0 ? "text-secondary" : "text-error"
                            }`}
                        >
                            {formatBRL(evolucaoPatrimonial)}
                        </p>
                    </Card>
                </div>

                <Card>
                    <Tabs defaultValue="bens-e-direitos">
                        <TabsList>
                            <TabsTrigger value="bens-e-direitos">Bens e Direitos</TabsTrigger>
                            <TabsTrigger value="rendimentos-isentos">Rend. Isentos e Não Tributáveis</TabsTrigger>
                            <TabsTrigger value="rendimentos-exclusivos">Rend. Sujeitos à Trib. Exclusiva</TabsTrigger>
                        </TabsList>

                        <div className="p-4 md:p-6">
                            <TabsContent value="bens-e-direitos">
                                <div className="flex justify-between items-center mb-4">
                                    <div>
                                        <h3 className="text-lg font-medium">Bens e Direitos</h3>
                                        <p className="text-sm text-on-surface-variant">
                                            Seu patrimônio em 31/12/2023 e 31/12/2024.
                                        </p>
                                    </div>
                                    <Button variant="outlined" leftIcon={<PlusIcon className="w-4 h-4" />}>
                                        Adicionar Bem
                                    </Button>
                                </div>
                                <div className="overflow-x-auto border border-outline rounded-lg">
                                    <table className="w-full text-left text-sm">
                                        <thead className="bg-surface-variant/20">
                                            <tr>
                                                <th className="p-3 font-medium text-on-surface-variant">Código</th>
                                                <th className="p-3 font-medium text-on-surface-variant">Tipo</th>
                                                <th className="p-3 font-medium text-on-surface-variant">
                                                    Discriminação
                                                </th>
                                                <th className="p-3 font-medium text-on-surface-variant text-right">
                                                    Situação em 31/12/2023
                                                </th>
                                                <th className="p-3 font-medium text-on-surface-variant text-right">
                                                    Situação em 31/12/2024
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {assets.map((asset) => (
                                                <TaxAssetRow key={asset.id} asset={asset} />
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </TabsContent>

                            <TabsContent value="rendimentos-isentos">
                                <div className="flex justify-between items-center mb-4">
                                    <div>
                                        <h3 className="text-lg font-medium">Rendimentos Isentos e Não Tributáveis</h3>
                                        <p className="text-sm text-on-surface-variant">
                                            Valores recebidos que não possuem incidência de imposto.
                                        </p>
                                    </div>
                                    <Button variant="outlined" leftIcon={<PlusIcon className="w-4 h-4" />}>
                                        Adicionar Rendimento
                                    </Button>
                                </div>
                                <div className="overflow-x-auto border border-outline rounded-lg">
                                    <table className="w-full text-left text-sm">
                                        <thead className="bg-surface-variant/20">
                                            <tr>
                                                <th className="p-3 font-medium text-on-surface-variant">Código</th>
                                                <th className="p-3 font-medium text-on-surface-variant">
                                                    Tipo de Rendimento
                                                </th>
                                                <th className="p-3 font-medium text-on-surface-variant">
                                                    Fonte Pagadora
                                                </th>
                                                <th className="p-3 font-medium text-on-surface-variant text-right">
                                                    Valor
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {exemptIncomes.map((income) => (
                                                <TaxIncomeRow key={income.id} income={income} />
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </TabsContent>
                            <TabsContent value="rendimentos-exclusivos">
                                <div className="flex justify-between items-center mb-4">
                                    <div>
                                        <h3 className="text-lg font-medium">
                                            Rendimentos Sujeitos à Tributação Exclusiva/Definitiva
                                        </h3>
                                        <p className="text-sm text-on-surface-variant">
                                            Rendimentos com imposto retido na fonte.
                                        </p>
                                    </div>
                                    <Button variant="outlined" leftIcon={<PlusIcon className="w-4 h-4" />}>
                                        Adicionar Rendimento
                                    </Button>
                                </div>
                                <div className="overflow-x-auto border border-outline rounded-lg">
                                    <table className="w-full text-left text-sm">
                                        <thead className="bg-surface-variant/20">
                                            <tr>
                                                <th className="p-3 font-medium text-on-surface-variant">Código</th>
                                                <th className="p-3 font-medium text-on-surface-variant">
                                                    Tipo de Rendimento
                                                </th>
                                                <th className="p-3 font-medium text-on-surface-variant">
                                                    Fonte Pagadora
                                                </th>
                                                <th className="p-3 font-medium text-on-surface-variant text-right">
                                                    Valor
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {exclusiveIncomes.map((income) => (
                                                <TaxIncomeRow key={income.id} income={income} />
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </TabsContent>
                        </div>
                    </Tabs>
                </Card>

                {isGenerating && (
                    <div className="flex justify-center items-center py-10">
                        <Spinner />
                    </div>
                )}

                {aiSummary && (
                    <Card className="p-6 bg-primary-container/50 border border-primary/20">
                        <div className="flex items-center gap-3 mb-4">
                            <SparklesIcon className="w-6 h-6 text-primary" />
                            <h2 className="text-xl font-medium text-on-surface">Resumo da Declaração (IA)</h2>
                        </div>
                        <MarkdownRenderer content={aiSummary} />
                    </Card>
                )}
            </main>
        </div>
    );
};

export default TaxScreen;
