// Funktion för att beräkna produkt-layoutklasser baserat på index
export const getProductLayoutClasses = (index: number): string => {
  const cyclePosition = index % 7;

  let classes = 'cursor-pointer';

  switch (cyclePosition) {
    case 2:
      classes += ' row-start-2';
      break;
    case 3:
      classes += ' row-start-2';
      break;
    case 4:
      classes += ' col-span-2 row-span-2 row-start-3';
      break;
    case 5:
      classes += ' row-start-5';
      break;
    case 6:
      classes += ' row-start-5';
      break;
  }

  return classes;
};

// Funktion för att beräkna bildhöjdsklasser baserat på cykliska mönster
export const getImageHeightClasses = (index: number): string => {
  return index % 7 === 4 ? 'h-[471px] md:h-[571px]' : 'h-[236px]';
};

// Hjälpfunktion för att formatera produktnamn
export const capitalizeFirstLetter = (name: string) => {
  return name.charAt(0).toUpperCase() + name.slice(1).toLocaleLowerCase();
};
