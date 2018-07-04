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
    
    const {required, jsExpressionNonEmptyString, generateValidators, minLength} = validators;

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
                  date: generateValidators('template.validateRequired', { required })
                },
                timeZone: {
                  value: { required }
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
              date: generateValidators('template.validateRequired', { required })
            },
            timeZone: {
              value: { required }
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