export const handleTaxSwitchEvents = (container: HTMLElement) => {
  const taxSwitches = container.querySelectorAll(".tax-switch");
  taxSwitches.forEach((taxSwitch) => {
    taxSwitch.addEventListener("change", () => {
      const isChecked = (taxSwitch as HTMLInputElement).checked;
      const listingCards = container.querySelectorAll(".listing-card");
      listingCards.forEach((card) => {
        const taxInfo = card.querySelector(".tax-info") as HTMLElement;
        taxInfo.style.display = isChecked ? "none" : "inline";
      });
    });
  });

  taxSwitches.forEach((taxSwitch) => {
    const event = new Event("change");
    taxSwitch.dispatchEvent(event);
  });
};
