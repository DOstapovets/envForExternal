import _ from "lodash";
import later from "later";
import moment from "moment-timezone";

export default {
    created() {
        console.log('selectedDays', this.selectedDays);
    },
    computed: {
        highlightedDates() {
            const resultArr = {};
            [].concat(this.selectedDays.map(item => {
                let startInterval;
                let endInterval
                const endDate = !item.isEndTime ? item.endExpression.date : undefined;
                const startDate = item.startExpression.date;
                let atDates = [];
                let returnValue = [];
                if (this.state === 'month') {
                    startInterval = moment(`${this.interval.start}, ${this.interval.year}`).format('YYYY-MM-DD');
                    endInterval = moment(`${this.interval.end}, ${this.interval.year}`).format('YYYY-MM-DD');
                } else if (this.state === 'year') {
                    startInterval = `${this.interval.year}-01-01`;
                    endInterval = `${this.interval.year}-12-31`;
                }
                if (startDate && startInterval !== 'Invalid date') {
                    const start = !startDate || moment(startInterval).isSameOrBefore(moment(startDate)) ? startDate : startInterval;
                    const end = !endDate || moment(endInterval).isSameOrBefore(moment(endDate)) ? endInterval : endDate;
                    console.log('end', end);
                    // console.log('startDate', startDate);
                    // console.log('startInterval', startInterval);
                    if (item.isReccuring && item.expressions.length > 0) {
                        atDates = item.expressions.map(expItem => later.schedule(later.parse.cron(expItem)).next(Infinity, new Date(start), new Date(new Date(end).getTime() + (24 * 60 * 60 * 1000))));
                        console.log('atDates', atDates);
                        returnValue =  {
                            dates: [].concat(...atDates.map(itemExprs => itemExprs.map(itemExpr => {
                                const itemExprSplit = moment(itemExpr).format('YYYY-MM-DD').split('-');
                                return {
                                    year: parseInt(itemExprSplit[0], 10),
                                    month: parseInt(itemExprSplit[1], 10),
                                    day: parseInt(itemExprSplit[2], 10), 
                                }
                            }))),
                            color: item.color,
                            eventName: item.eventName,
                            lighter: true,

                        };
                    } else {
                        returnValue =  null;
                    }
                }
                return returnValue;
        
            }), 
            this.selectedDays.map(itemSelectedDays => ({
                dates: [itemSelectedDays.date],
                color: itemSelectedDays.color,
                eventName: itemSelectedDays.eventName,
                lighter: false,
            }))).
            forEach(item => {
                if (!item || !item.dates ) return;
                item.dates.forEach(datesItem => {
                    if (!_.isArray(resultArr[`${datesItem.year}-${datesItem.month}-${datesItem.day}`])) {
                        resultArr[`${datesItem.year}-${datesItem.month}-${datesItem.day}`] = [];
                    }
                    resultArr[`${datesItem.year}-${datesItem.month}-${datesItem.day}`].push({ color: item.color, eventName: item.eventName, lighter: item.lighter});
                });
            });
            return resultArr;
        }
    },
    watch: {
        selectedDays: {
            handler(newValue) {
                console.log('newValue', newValue);
            },
            deep: true
        }
    }
}