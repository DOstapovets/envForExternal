<template>
  <div>   
     <!-- {{$v}}
     <br/>
     <br/>
     <br/> -->
     <!-- {{schemaValidation}} -->
     <!-- {{validationCopyScheduleEventData}} -->
      <schedule-events
        :schedule-events.sync="scheduleEventsComp"
        :step="step"
        :stepId="stepId"
        :$v="$v"
        @new-copy-schedule-event-data="newCopyScheduleEventData"
      ></schedule-events>
  </div>
</template>

<script>
    import * as _ from 'lodash';
    /* eslint-disable */
    import ScheduleEvents from './ScheduleEvents/ScheduleEvents.vue';
    import {validators} from '../../../../../validators.js';
    /* eslint-enable */
    
    const {required, jsExpressionNonEmptyString, generateValidators, minValue, minLength} = validators;

    // export const validator = (template) => {
    //   return {
    //       scheduleEvents : generateValidators(template.validateRequired, {required}),
    //   };
    // };

    export const validator = (template) => {
      return {
        schemaValidation: {
          required,
          scheduleEvents: {
            required,
            $each: {
              required,
              scheduleEventData: {
                required,
                startExpression: {
                  required,
                  date: { required }
                },
                endExpression: {
                  required,
                  date: { required }
                  // date: (state) => {
                  //   console.log('state', state)
                  //   return false;
                  // }  
                },
                timeZone: {
                  value: { required }
                },
                times: {
                  $each: {
                      start: {
                        HH: { required },
                        mm: { required },
                      },
                      end: {
                        HH: { required },
                        mm: { required },
                      },
                      every: {
                        val: { required, minValue: minValue(1) },
                        units: { required },
                      },
                    },
                }
              }
            }
          }
        },
        validationCopyScheduleEventData: {
            required,
            startExpression: {
              required,
              date: generateValidators('template.validateRequired', { required })
            },
            endExpression: {
              required,
              date: { required }
              // date: (state, sdf) => {
              //   console.log('state', state, sdf.isEndTime)
              //   return false;
              // }  
            },
            timeZone: {
              value: { required }
            },
            times: {
              $each: {
                  start: {
                    HH: { required },
                    mm: { required },
                  },
                  end: {
                    HH: { required },
                    mm: { required },
                  },
                  every: {
                    val: { required, minValue: minValue(1) },
                    units: { required },
                  },
                },
            },
            daily: {
              period: { required, minValue: minValue(1) }
            },
            weekly: {
              period: { required, minValue: minValue(1) },
              weekDays: { required }
            },
            monthly: {
                selectedMonths: { required },
                selectedDays: { required },
            },
            yearly: {
              period: { required, minValue: minValue(1) },
              selectedMonths: { required },
            }
        }
      };
    };

    export const data = () => ({
      scheduleEvents  : [],
    });

    export default {
      props: [
        'template',
        'schema',
        'step',
        'stepId',
        'steps',
        'readonly',
      ],
      computed: {
      scheduleEventsComp: {
          get() {
            return _.get(this, 'schema.scheduleEvents', null) || [];
          },
          set(newValue) {
            if (_.get(this, 'schema.scheduleEvents', null)) {
              this.schema.scheduleEvents = newValue;
            }
          }
        }
      },
      methods: {
        newCopyScheduleEventData(newValue) {
          console.log('validationCopyScheduleEventData', this.validationCopyScheduleEventData)
          this.validationCopyScheduleEventData = newValue;
        }
      },
      components: { ScheduleEvents },
      // validations: {
      //   email: { required } // rules object
      // },
      validations () {
        return validator(this.template);
      },
      data() {
        return  {
          schemaValidation: this.schema,
          validationCopyScheduleEventData: null
        }
      }
    };

    export const meta = {
      name    : 'schedule-component',
      type    : 'onereach-studio-form-editor',
      version : '0.5.0'
    };
</script>