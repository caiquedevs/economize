// src/extendNumber.ts

console.custom = function (description, ...args) {
  console.group(description);
  console.log(...args);
  console.groupEnd();
};

interface Console {
  custom: (description: string, args: any) => any;
}

interface Number {
  toCurrency(this: number): string;
  toSimpleCurrency(this: number): string;
  twoFixed(this: number): number;
}

interface String {
  twoFixed(this: string): number;
  maskCurrency(this: string): string;
}

// Adicionando o método toCurrency ao protótipo de Number
if (!Number.prototype.toCurrency) {
  Number.prototype.toCurrency = function (this: number) {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(this);
  };
}

if (!Number.prototype.toSimpleCurrency) {
  Number.prototype.toSimpleCurrency = function (this: number) {
    return new Intl.NumberFormat('pt-BR', {
      minimumFractionDigits: 2,
    }).format(this);
  };
}

if (!String.prototype.twoFixed) {
  String.prototype.twoFixed = function (this: string) {
    const value = Number(this);

    if (!value) return 0;

    const [integerPart, decimalPart] = value.toString().split('.');

    if (decimalPart && decimalPart.length > 2) {
      return parseFloat(`${integerPart}.${decimalPart.slice(0, 2)}`);
    }

    return value;
  };
}

if (!Number.prototype.twoFixed) {
  Number.prototype.twoFixed = function (this: number) {
    const value = Number(this);

    if (!value) return 0;

    const [integerPart, decimalPart] = value.toString().split('.');

    if (decimalPart && decimalPart.length > 2) {
      return parseFloat(`${integerPart}.${decimalPart.slice(0, 2)}`);
    }

    return value;
  };
}

if (!String.prototype.maskCurrency) {
  String.prototype.maskCurrency = function (this: string) {
    const value = this.replace(/[^0-9]/g, '');
    const formatted = value.replace(/^(\d+)(\d{2})$/, '$1.$2');
    return formatted;
  };
}
