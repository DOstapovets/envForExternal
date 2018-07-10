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
            [].concat(
                this.selectedDays.map(item => {
                    let startInterval;
                    let endInterval;
                    const endDate = !item.isEndTime ? item.endExpression.date : undefined;
                    const startDate = item.startExpression.date;
                    let atDates = [];
                    let returnValue = [];
                    if (this.state === 'month') {
                        startInterval = moment(`${this.interval.start}, ${_.get(this.interval, 'year')}`);
                        endInterval = moment(`${this.interval.end}, ${_.get(this.interval, 'year')}`);
                        if (endInterval.format('MM') === '01' && endInterval.format('DD') !== '31') {
                            endInterval.add(1, 'years');
                        }
                        if (startInterval.format('MM') === '12' && startInterval.format('DD') !== '01') {
                            startInterval.subtract(1, 'years');
                        }
                        console.log('endInterval.getMonth()', endInterval.format('MM'));

                        startInterval = startInterval.format('YYYY-MM-DD');
                        endInterval = endInterval.format('YYYY-MM-DD');
                    } else if (this.state === 'year') {
                        startInterval = `${_.get(this.interval, 'year')}-01-01`;
                        endInterval = moment(`${_.get(this.interval, 'year')}-12-31`).add(7, 'days').format('YYYY-MM-DD');
                    }
                    if (startDate && startInterval !== 'Invalid date') {
                        const start = !startDate || moment(startInterval).isSameOrBefore(moment(startDate)) ? startDate : startInterval;
                        const end = moment(!endDate || moment(endInterval).isSameOrBefore(moment(endDate)) ? endInterval : endDate).add(1, 'days').format('YYYY-MM-DD');
                        console.log('endend', end);
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
                            // console.log('atDatesatDates', atDates);
                            // console.log('atDates', atDates);
                            returnValue = {
                                dates: [].concat(...atDates.map(itemExprs =>
                                    //     {
                                    //     const itemExprSplit = moment(itemExprs[0]).format('YYYY-MM-DD').split('-');
                                    //     return {
                                    //         year: parseInt(itemExprSplit[0], 10),
                                    //         month: parseInt(itemExprSplit[1], 10),
                                    //         day: parseInt(itemExprSplit[2], 10), 
                                    //     }
                                    // })),

                                    itemExprs
                                        ?
                                        itemExprs.map(itemExpr => {
                                            const date = moment(itemExpr);

                                            return {
                                                date: {
                                                    year: parseInt(date.format('YYYY'), 10),
                                                    month: parseInt(date.format('MM'), 10),
                                                    day: parseInt(date.format('DD'), 10),
                                                },
                                                time: date.format('HH:mm'),
                                            }
                                        })
                                        :
                                        {
                                            year: null,
                                            month: null,
                                            day: null,
                                        }))
                                    .reduce((res, cur) => {
                                        const index = _.findIndex(res, itemFilter => _.get(itemFilter, 'date.year') === cur.date.year && itemFilter.date.month === cur.date.month && itemFilter.date.day === cur.date.day);
                                        if (index === -1) {
                                            res.push({
                                                date: {
                                                    year: _.get(cur, 'date.year'),
                                                    month: _.get(cur, 'date.month'),
                                                    day: _.get(cur, 'date.day'),
                                                },
                                                time: [cur.time],
                                            });
                                        } else {
                                            res[index].time.push(cur.time);
                                        }
                                        return res;
                                    }, []),
                                color: item.color,
                                eventName: item.eventName,
                                // lighter: true,

                            };
                            console.log('returnValue', returnValue);
                        } else {
                            returnValue = null;
                        }
                    }
                    return returnValue;

                }),
                this.selectedDays.filter(item => !item.isReccuring).map(itemSelectedDays => ({
                    dates: [{ date: itemSelectedDays.date }],
                    color: itemSelectedDays.color,
                    eventName: itemSelectedDays.eventName,
                    // lighter: false,
                }))).
                forEach(item => {
                    if (!item || !item.dates) return;
                    item.dates.forEach((datesItemFromArr, index) => {
                        const datesItem = datesItemFromArr.date;
                        if (!_.isArray(resultArr[`${datesItem.year}-${datesItem.month}-${datesItem.day}`])) {
                            resultArr[`${datesItem.year}-${datesItem.month}-${datesItem.day}`] = [];
                        }
                        resultArr[`${datesItem.year}-${datesItem.month}-${datesItem.day}`].push({
                            color: item.color,
                            eventName: item.eventName,
                            lighter: !(index === 0),
                        });
                    });
                });
            console.log('resultArr', resultArr);
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