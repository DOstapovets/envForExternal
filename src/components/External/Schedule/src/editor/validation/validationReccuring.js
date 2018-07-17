export default {
    daily: (value) => {
        let valid = true;
        if (value.savedAccordionSlotName === 'item1'
            && value.daily.periodMode === 'everyDay' &&
            (!value.daily.period || value.daily.period < 1)
        ) {
            valid = false;
        }
        return valid;
    },
    weekly: (value) => {
        let valid = true;
        if (
            value.savedAccordionSlotName === 'item2' &&
            (!value.weekly.period ||
                value.weekly.period < 1 ||
                !value.weekly.weekDays.length)
        ) {
            valid = false;
        }
        return valid;
    },
    monthly: (value) => {
        let valid = true;
        if (
            value.savedAccordionSlotName === 'item3' &&
            (!value.monthly.selectedMonths.length ||
                (value.monthly.mode === 'each' && !value.monthly.selectedDays.length))
        ) {
            valid = false;
        }
        return valid;
    },
    yearly: (value) => {
        let valid = true;
        if (
            value.savedAccordionSlotName === 'item4' &&
            (!value.yearly.period ||
                value.yearly.period < 1 ||
                !value.yearly.selectedMonths.length)
        ) {
            valid = false;
        }
        return valid;
    },
}