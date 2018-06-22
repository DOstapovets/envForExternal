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
                    startInterval = moment(`${this.interval.start}, ${this.interval.year}`);
                    endInterval = moment(`${this.interval.end}, ${this.interval.year}`);
                    if (endInterval.format('MM') === '01' && endInterval.format('DD') !== '31') {
                        endInterval.add('years', 1);
                    }
                    if (startInterval.format('MM') === '12' && startInterval.format('DD') !== '01') {
                        startInterval.subtract('years', 1);
                    }
                    console.log('endInterval.getMonth()', endInterval.format('MM'));
                    
                    startInterval = startInterval.format('YYYY-MM-DD');
                    endInterval = endInterval.format('YYYY-MM-DD');
                } else if (this.state === 'year') {
                    startInterval = `${this.interval.year}-01-01`;
                    endInterval = moment(`${this.interval.year}-12-31`).add('days', 7).format('YYYY-MM-DD');
                }
                if (startDate && startInterval !== 'Invalid date') {
                    const start = !startDate || moment(startInterval).isSameOrBefore(moment(startDate)) ? startDate : startInterval;
                    const end = moment(!endDate || moment(endInterval).isSameOrBefore(moment(endDate)) ? endInterval : endDate).format('YYYY-MM-DD');
                    // if (parseInt(end.format('MM'), 10) === 12) {
                    //     end.add('month', 1);
                    // }
                    // if (.format('MM')) {}
                    console.log('start', start);
                    console.log('end', end);
                    // end = end.format('YYYY-MM-DD');
                    // console.log('startDate', startDate);
                    // console.log('startInterval', startInterval);
                    if (item.isReccuring && item.expressions.length > 0) {
                        atDates = item.expressions.map(expItem => later.schedule(later.parse.cron(expItem)).next(Infinity, new Date(start), new Date(end)));
                        // console.log('atDates', atDates);
                        returnValue =  {
                            dates: [].concat(...atDates.map(itemExprs => itemExprs ? itemExprs.map(itemExpr => {
                                const itemExprSplit = moment(itemExpr).format('YYYY-MM-DD').split('-');
                                return {
                                    year: parseInt(itemExprSplit[0], 10),
                                    month: parseInt(itemExprSplit[1], 10),
                                    day: parseInt(itemExprSplit[2], 10), 
                                }
                            })
                            : 
                            {
                                year: null,
                                month: null,
                                day: null,
                            })),
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