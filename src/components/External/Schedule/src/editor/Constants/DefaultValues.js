export default  {
    daily: {
        periodMode: 'everyDay',
        period: '1',
        cronExpressions: [],
    },
    weekly: {
        period: '1',
        cronExpressions: [],
        weekDays: [],
    },
    monthly: {
        selectedMonths: [],
        selectedDays: [],
        mode: 'each',
        daysPeriod: { day: 'SUN', period: '' },
        period: '1',
        cronExpressions: [],
    },
    yearly: {
        selectedMonths: [],
        period: '1',
        cronExpressions: [],
        selectedDays: [],
        daysPeriod: { day: 'SUN', period: '' },
        onThe: false,
    },
}
