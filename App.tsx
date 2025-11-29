import React, { useState, useMemo, useEffect } from 'react';
import { 
  Printer, 
  Zap, 
  Package, 
  TrendingUp, 
  DollarSign, 
  Box, 
  Calculator,
  Download,
  AlertCircle,
  Moon,
  Sun
} from 'lucide-react';
import { SectionCard } from './components/SectionCard';
import { InputField } from './components/InputField';
import { CostData, CalculatedResults } from './types';

// Utility for currency formatting
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

const formatPercent = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 2,
  }).format(value / 100);
};

// Helper to safely parse string/number inputs for calculation
const getNumber = (value: string | number): number => {
  if (typeof value === 'number') return value;
  if (value === '' || value === null || value === undefined) return 0;
  // Replace comma with dot for Portuguese format support if necessary, though input[type=number] usually handles standard format
  const parsed = parseFloat(value.toString().replace(',', '.'));
  return isNaN(parsed) ? 0 : parsed;
};

const App: React.FC = () => {
  // Theme State
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check local storage or system preference
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
        return savedTheme === 'dark';
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // Apply theme class to HTML element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  // Initial Form State
  const [formData, setFormData] = useState<CostData>({
    partName: 'Minha Peça 3D',
    printTime: 5.5,
    partWeight: 150,
    filamentCost: 120.00,
    printerPower: 350,
    kwhCost: 0.95,
    packagingRollCost: 35.00,
    bagsPerRoll: 50,
    monthlyProduction: 40,
    monthlyFixedCost: 200.00,
    printerValue: 3500.00,
    printerLifespan: 10000,
    failureRate: 10,
    taxRate: 6,
    cardFee: 4.5,
    adCost: 15,
    markup: 3.0,
  });

  // Derived State (Calculations)
  const results: CalculatedResults = useMemo(() => {
    // Convert all inputs to safe numbers for calculation
    const printTime = getNumber(formData.printTime);
    const partWeight = getNumber(formData.partWeight);
    const filamentCost = getNumber(formData.filamentCost);
    const printerPower = getNumber(formData.printerPower);
    const kwhCost = getNumber(formData.kwhCost);
    const packagingRollCost = getNumber(formData.packagingRollCost);
    const bagsPerRoll = getNumber(formData.bagsPerRoll);
    const monthlyProduction = getNumber(formData.monthlyProduction);
    const monthlyFixedCost = getNumber(formData.monthlyFixedCost);
    const printerValue = getNumber(formData.printerValue);
    const printerLifespan = getNumber(formData.printerLifespan);
    const failureRate = getNumber(formData.failureRate);
    const markup = getNumber(formData.markup);
    const taxRate = getNumber(formData.taxRate);
    const cardFee = getNumber(formData.cardFee);
    const adCost = getNumber(formData.adCost);

    // 1. Material
    const filamentPrice = (partWeight / 1000) * filamentCost;

    // 2. Energy
    const energyConsumption = (printerPower * printTime) / 1000;
    const energyPrice = energyConsumption * kwhCost;

    // 3. Packaging
    const packagingPrice = bagsPerRoll > 0 ? packagingRollCost / bagsPerRoll : 0;

    // 4. Fixed Costs
    const fixedCostPerUnit = monthlyProduction > 0 ? monthlyFixedCost / monthlyProduction : 0;

    // 5. Depreciation
    const depreciationPrice = printerLifespan > 0 ? (printerValue / printerLifespan) * printTime : 0;

    // 6. Subtotals & Failure
    const subtotal = filamentPrice + energyPrice + packagingPrice + fixedCostPerUnit + depreciationPrice;
    const failurePrice = subtotal * (failureRate / 100);
    const totalBaseCost = subtotal + failurePrice;

    // 7. Pricing
    const sellingPrice = totalBaseCost * markup;

    // 8. Deductions (from Selling Price)
    const taxValue = sellingPrice * (taxRate / 100);
    const cardValue = sellingPrice * (cardFee / 100);
    const adValue = sellingPrice * (adCost / 100);
    
    // 9. Profit
    const grossProfit = sellingPrice - totalBaseCost; // Markup profit before fees
    const netProfit = sellingPrice - totalBaseCost - taxValue - cardValue - adValue;

    return {
      filamentPrice,
      energyConsumption,
      energyPrice,
      packagingPrice,
      fixedCostPerUnit,
      depreciationPrice,
      subtotal,
      failurePrice,
      totalBaseCost,
      sellingPrice,
      taxValue,
      cardValue,
      adValue,
      grossProfit,
      netProfit,
    };
  }, [formData]);

  const handleInputChange = (field: keyof CostData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen pb-12 transition-colors duration-200 print:pb-0 print:bg-white">
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-50 transition-colors duration-200 print:static print:border-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-lg shadow-sm">
              <Calculator className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800 dark:text-white leading-none">Calculadora 3D</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Precificação Inteligente</p>
            </div>
          </div>
          <div className="flex items-center gap-2 no-print">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
              aria-label="Toggle Dark Mode"
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button 
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-lg text-sm font-medium transition-colors"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Exportar PDF</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT COLUMN - INPUTS */}
          <div className="lg:col-span-7 space-y-6 print:w-full print:col-span-12">
            
            {/* 1. Basic Info */}
            <SectionCard title="Dados da Peça" icon={<Box className="w-5 h-5" />} color="indigo">
              <div className="sm:col-span-2">
                <InputField 
                  label="Nome da Peça" 
                  value={formData.partName} 
                  onChange={(v) => handleInputChange('partName', v)}
                  placeholder="Ex: Vaso Geométrico"
                />
              </div>
              <InputField 
                label="Tempo de Impressão" 
                value={formData.printTime} 
                onChange={(v) => handleInputChange('printTime', v)}
                type="number"
                suffix="horas"
                tooltip="Tempo total indicado no fatiador (slicer)"
              />
              <InputField 
                label="Peso Total" 
                value={formData.partWeight} 
                onChange={(v) => handleInputChange('partWeight', v)}
                type="number"
                suffix="gramas"
                tooltip="Peso incluindo suportes e raft"
              />
            </SectionCard>

            {/* 2. Material & Energy */}
            <SectionCard title="Material e Energia" icon={<Zap className="w-5 h-5" />} color="amber">
              <InputField 
                label="Custo Filamento" 
                value={formData.filamentCost} 
                onChange={(v) => handleInputChange('filamentCost', v)}
                type="number"
                suffix="R$/kg"
              />
              <InputField 
                label="Potência Impressora" 
                value={formData.printerPower} 
                onChange={(v) => handleInputChange('printerPower', v)}
                type="number"
                suffix="Watts"
                tooltip="Média de consumo da sua impressora"
              />
              <InputField 
                label="Custo Energia" 
                value={formData.kwhCost} 
                onChange={(v) => handleInputChange('kwhCost', v)}
                type="number"
                step="0.01"
                suffix="R$/kWh"
                tooltip="Valor do kWh na sua conta de luz"
              />
              <div className="flex flex-col gap-1.5 opacity-80">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Consumo Estimado</label>
                <div className="px-3 py-2 bg-slate-100 dark:bg-slate-700/50 rounded-lg text-slate-500 dark:text-slate-300 text-sm border border-transparent">
                  {results.energyConsumption.toFixed(3)} kWh
                </div>
              </div>
            </SectionCard>

            {/* 3. Packaging & Fixed */}
            <SectionCard title="Embalagem e Fixos" icon={<Package className="w-5 h-5" />} color="emerald">
              <InputField 
                label="Valor Rolo/Pacote" 
                value={formData.packagingRollCost} 
                onChange={(v) => handleInputChange('packagingRollCost', v)}
                type="number"
                suffix="R$"
                tooltip="Custo do rolo de plástico bolha ou pacote de caixas"
              />
              <InputField 
                label="Embalagens por Rolo" 
                value={formData.bagsPerRoll} 
                onChange={(v) => handleInputChange('bagsPerRoll', v)}
                type="number"
                suffix="unid"
                tooltip="Quantas embalagens rende um rolo/pacote"
              />
              <InputField 
                label="Unidades/Mês" 
                value={formData.monthlyProduction} 
                onChange={(v) => handleInputChange('monthlyProduction', v)}
                type="number"
                suffix="peças/mês"
                tooltip="Média de peças impressas por mês para rateio"
              />
              <InputField 
                label="Custo Fixo Mensal" 
                value={formData.monthlyFixedCost} 
                onChange={(v) => handleInputChange('monthlyFixedCost', v)}
                type="number"
                suffix="R$"
                tooltip="Aluguel, internet, softwares, manutenção, etc."
              />
            </SectionCard>

            {/* 4. Depreciation */}
            <SectionCard title="Amortização Máquina" icon={<Printer className="w-5 h-5" />} color="rose">
              <InputField 
                label="Valor da Impressora" 
                value={formData.printerValue} 
                onChange={(v) => handleInputChange('printerValue', v)}
                type="number"
                suffix="R$"
              />
              <InputField 
                label="Vida Útil Estimada" 
                value={formData.printerLifespan} 
                onChange={(v) => handleInputChange('printerLifespan', v)}
                type="number"
                suffix="horas"
                tooltip="Geralmente entre 10.000 a 20.000 horas"
              />
            </SectionCard>

            {/* 5. Taxes & Pricing */}
            <SectionCard title="Taxas e Precificação" icon={<TrendingUp className="w-5 h-5" />} color="violet">
              <InputField 
                label="% de Falhas" 
                value={formData.failureRate} 
                onChange={(v) => handleInputChange('failureRate', v)}
                type="number"
                suffix="%"
                tooltip="Margem de segurança para impressões que dão errado"
              />
              <InputField 
                label="Imposto (DAS/NF)" 
                value={formData.taxRate} 
                onChange={(v) => handleInputChange('taxRate', v)}
                type="number"
                suffix="%"
              />
              <InputField 
                label="Taxa Cartão/Gateway" 
                value={formData.cardFee} 
                onChange={(v) => handleInputChange('cardFee', v)}
                type="number"
                suffix="%"
              />
              <InputField 
                label="Custo Anúncio (Ads)" 
                value={formData.adCost} 
                onChange={(v) => handleInputChange('adCost', v)}
                type="number"
                suffix="%"
              />
              <div className="sm:col-span-2 mt-2">
                 <InputField 
                  label="Markup (Multiplicador)" 
                  value={formData.markup} 
                  onChange={(v) => handleInputChange('markup', v)}
                  type="number"
                  step="0.1"
                  placeholder="Ex: 3.0"
                  tooltip="Multiplica o custo base para gerar o preço de venda"
                />
              </div>
            </SectionCard>
          </div>

          {/* RIGHT COLUMN - RESULTS */}
          <div className="lg:col-span-5 space-y-6 print:break-before-page print:w-full print:col-span-12">
            
            {/* Cost Breakdown */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-6 sticky top-24 print:static transition-colors duration-200">
              <h3 className="font-bold text-slate-800 dark:text-white text-lg mb-6 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                Composição de Custos
              </h3>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center py-2 border-b border-slate-50 dark:border-slate-700/50">
                  <span className="text-slate-600 dark:text-slate-400">Filamento ({getNumber(formData.partWeight)}g)</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">{formatCurrency(results.filamentPrice)}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-50 dark:border-slate-700/50">
                  <span className="text-slate-600 dark:text-slate-400">Energia ({results.energyConsumption.toFixed(2)} kWh)</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">{formatCurrency(results.energyPrice)}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-50 dark:border-slate-700/50">
                  <span className="text-slate-600 dark:text-slate-400">Embalagem</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">{formatCurrency(results.packagingPrice)}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-50 dark:border-slate-700/50">
                  <span className="text-slate-600 dark:text-slate-400">Custo Fixo (Rateio)</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">{formatCurrency(results.fixedCostPerUnit)}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-50 dark:border-slate-700/50">
                  <span className="text-slate-600 dark:text-slate-400">Amortização Máquina</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">{formatCurrency(results.depreciationPrice)}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-50 dark:border-slate-700/50 bg-rose-50/50 dark:bg-rose-900/20 -mx-6 px-6">
                  <span className="text-rose-600 dark:text-rose-400 font-medium">Margem de Falha ({getNumber(formData.failureRate)}%)</span>
                  <span className="font-medium text-rose-700 dark:text-rose-300">{formatCurrency(results.failurePrice)}</span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-700">
                <div className="flex justify-between items-end">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">Custo de Produção</span>
                  <span className="text-2xl font-bold text-slate-800 dark:text-white">{formatCurrency(results.totalBaseCost)}</span>
                </div>
                <p className="text-xs text-slate-400 dark:text-slate-500 text-right mt-1">Material + Energia + Fixos + Depr + Falhas</p>
              </div>
            </div>

            {/* Final Pricing */}
            <div className="bg-indigo-600 dark:bg-indigo-700 rounded-xl shadow-lg shadow-indigo-200 dark:shadow-none text-white p-6 sticky top-[500px] print:static print:shadow-none print:border print:border-indigo-200 print:text-black transition-colors duration-200">
              <div className="flex items-center gap-2 mb-4 opacity-90 print:text-indigo-700">
                <TrendingUp className="w-5 h-5" />
                <h3 className="font-semibold text-lg">Resultado Final</h3>
              </div>

              <div className="mb-8">
                <p className="text-indigo-100 text-sm mb-1 print:text-slate-500">Preço de Venda Sugerido</p>
                <div className="text-4xl font-bold tracking-tight">{formatCurrency(results.sellingPrice)}</div>
                <div className="text-indigo-200 text-xs mt-1 print:text-slate-400">Markup aplicado: {getNumber(formData.markup).toFixed(2)}x</div>
              </div>

              <div className="space-y-2 bg-indigo-700/50 dark:bg-indigo-800/50 rounded-lg p-4 print:bg-slate-50 print:border print:border-slate-200">
                <div className="flex justify-between text-sm">
                  <span className="text-indigo-100 print:text-slate-600">Imposto ({getNumber(formData.taxRate)}%)</span>
                  <span className="font-mono print:text-slate-800">{formatCurrency(results.taxValue)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-indigo-100 print:text-slate-600">Taxa Cartão ({getNumber(formData.cardFee)}%)</span>
                  <span className="font-mono print:text-slate-800">{formatCurrency(results.cardValue)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-indigo-100 print:text-slate-600">Anúncio/Ads ({getNumber(formData.adCost)}%)</span>
                  <span className="font-mono print:text-slate-800">{formatCurrency(results.adValue)}</span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-indigo-500/50 print:border-slate-200">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-indigo-50 print:text-slate-600">Lucro Líquido</span>
                  <span className={`text-xl font-bold ${results.netProfit > 0 ? 'text-emerald-300 print:text-emerald-600' : 'text-rose-300 print:text-rose-600'}`}>
                    {formatCurrency(results.netProfit)}
                  </span>
                </div>
                 <div className="flex justify-between items-center text-xs text-indigo-200 print:text-slate-400">
                  <span>Margem Líquida</span>
                  <span>{formatPercent(results.netProfit > 0 ? (results.netProfit / results.sellingPrice) * 100 : 0)}</span>
                </div>
              </div>
            </div>

             {/* Tips Card */}
            <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-100 dark:border-amber-800/50 p-4 no-print transition-colors duration-200">
               <div className="flex gap-3">
                 <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-500 flex-shrink-0" />
                 <div>
                   <h4 className="font-semibold text-amber-800 dark:text-amber-200 text-sm">Dica de Precificação</h4>
                   <p className="text-amber-700 dark:text-amber-400 text-xs mt-1 leading-relaxed">
                     Se a sua margem líquida estiver abaixo de 20%, considere aumentar o Markup ou reduzir o tempo de impressão otimizando o fatiamento.
                   </p>
                 </div>
               </div>
            </div>

          </div>
        </div>
      </main>
      
      <footer className="max-w-7xl mx-auto px-4 py-6 text-center text-slate-400 dark:text-slate-500 text-sm no-print transition-colors duration-200">
        <p>&copy; {new Date().getFullYear()} 3D Cost Calc Pro. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
};

export default App;