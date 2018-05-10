<template>
<div class="schedule-step">
    <label class="timezone">
        <span class="timezone__label">Timezone</span>
        <or-select :disabled="readonly" placeholder="Select a time zone" class="config-line__select" :has-search="true" :options="getRegions"
            v-model="displayTimeZone">
        </or-select>
    </label>
      
    <div class="wr-start-date">
      <div class="choose-date choose-date_start">Choose date on calendar</div>
      <!-- <div class="configs-time">
          <or-icon class="configs-time__icon" icon="query_builder"></or-icon>
          <or-timepicker v-model="objectStartTime" :class="[{ readony: readonly }]" format="HH:mm" hideClearButton></or-timepicker>
      </div> -->
    </div>
    {{startDate}}
    <div class="schedule-step__start">
        <div class="schedule-step__start-configs">
            <or-datepicker :disabled="readonly" :class="['schedule-step__start-configs_date calendar-picker', { 'text-box-error': !isStartDateValid && ($v && $v.schema.$error) }]"
                iconPosition="right" placeholder="Select date" :custom-formatter="formatDate" v-model="startDate">Date
            </or-datepicker>
    
            <div class="schedule-step__start-configs_time">
                <div class="label">Time</div>
                <or-icon icon="query_builder"></or-icon>
                <or-timepicker v-model="objectStartTime" :class="[{ readony: readonly }]" format="HH:mm" hideClearButton></or-timepicker>
            </div>
        </div>
    </div>
    <or-list class="list-time" drag-handle-right v-model="times" add-button-label="Add Time" :new-item-method="listNewItemTime">
        <template scope="item">
            <div class="wr-time-item">
                <div class="wr-configs-every">
                    <div class="configs-time__wr">
                        <div class="configs-time">
                            <or-icon class="configs-time__icon" icon="query_builder"></or-icon>
                            <or-timepicker v-model="item.item.start" :class="[{ readony: readonly }]" format="HH:mm" hideClearButton></or-timepicker>
                        </div>
                        <span class="configs-time__from-to" v-if="item.item.endTime">To</span>
                        <div class="configs-time" v-if="item.item.endTime">
                            <or-icon class="configs-time__icon" icon="query_builder"></or-icon>
                            <or-timepicker v-model="item.item.end" :class="[{ readony: readonly }]" format="HH:mm" hideClearButton></or-timepicker>
                        </div>
                    </div>
                    <div v-if="item.item.endTime" class="every">
                        <span>every</span>
                        <or-textbox label="" placeholder="00" :class="['xs-input', {'text-box-error': !item.item.every.val}]" :disabled="readonly"
                            v-model="item.item.every.val">
                        </or-textbox>
                        <or-select label="" :disabled="readonly" class="dimention-selector" :options="[{value:'hh', label:'hr'}, {value:'mm', label:'min'}]"
                            v-model="item.item.every.units">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                <path d="M6.984 9.984h10.03L12 15z" />
                            </svg>
                        </or-select>
                    </div>
                </div>
                <span class="configs-time__end-time" v-if="!item.item.endTime" @click="item.item.endTime=!item.item.endTime">+End Time</span>
            </div>
        </template>
    </or-list>
    <div class="schedule-step__recuring">
        <div class="schedule-step__recuring-active">
            <or-checkbox v-model="isReccuringChecked" :disabled="readonly">Recurring</or-checkbox>
            <span v-if="!isEndChecked" class="schedule-step__recuring-till">till</span>
            <div class="schedule-step__end-wrapper">
                <div class="schedule-step__end" v-if="!isEndChecked">
                    <div class="schedule-step__end-configs">
                        <!-- <ui-datepicker :disabled="readonly" class="schedule-step__end-configs_date calendar-picker" iconPosition="right" placeholder="Select date"
                            :custom-formatter="formatDate" v-model="endDate">
                        </ui-datepicker> -->
                        <!-- <div class="choose-date choose-date_end">Choose date on calendar</div> -->
                        
                        <div class="configs-time__with-conf">
                          <!-- <div class="configs-time configs-time_with-conf">
                            <or-icon class="configs-time__icon" icon="query_builder"></or-icon>
                            <or-timepicker v-model="objectEndTime" :class="[{ readony: readonly }]" format="HH:mm" hideClearButton></or-timepicker>
                          </div> -->
                          <div class="configs-time configs-time__date">
                            <or-icon class="configs-time__icon" icon="view_comfy"></or-icon>
                            <ui-datepicker :disabled="readonly" class="calendar-picker__custom" iconPosition="right" placeholder="Select date"
                                :custom-formatter="formatDate" v-model="endDate">
                            </ui-datepicker>
                          </div>
                            <!-- <div class="schedule-step__include-end-active">
                                <or-checkbox v-model="isIncludedEndTime" :disabled="readonly">
                                  Include the end time in schedule execution
                                </or-checkbox>
                            </div> -->
                        </div>
                    </div>
                </div>
                <div class="schedule-step__end-active">
                    <or-checkbox v-model="isEndChecked" :disabled="readonly">No end</or-checkbox>
                </div>
            </div>
        </div>
        <div v-if="isReccuringChecked" class="schedule-step__recuring-table accordion__wr">
          <accordion>
              <template  slot="item1">
                  <div placeholderItem="Set recurring daily"  titleItem="Daily">
                    <div class="schedule-step__recuring-configs">
                      <div class="wr-config-event">
                        <div class="recuring-configs__daily">
                          <div class="tab-wrapper section-border">
                              <div class="recuring-configs__daily-date">
                                  <div class="recuring-configs__daily-date__section">
                                      <div class="config-line">
                                          <or-radio v-model="dailyPeriodMode" true-value="everyDay" class="config-line__radio" :disabled="readonly">
                                              Every:
                                          </or-radio>
                                          <or-textbox :disabled="readonly || dailyPeriodMode !== 'everyDay'" :class="['xs-input', {'text-box-error': !dailySchedule.isDailyDaysValid}]"
                                              label="" v-model="displayDailyDays" placeholder="">
                                          </or-textbox>
                                          <div class="config-line__dimansion">day(s)</div>
                                      </div>
                                      <div class="config-line">
                                          <or-radio v-model="dailyPeriodMode" true-value="evenDay" class="config-line__radio" :disabled="readonly">
                                              Every:
                                          </or-radio>
                                          <div class="config-line__dimansion">even day</div>
                                      </div>
                                      <div class="config-line">
                                          <or-radio v-model="dailyPeriodMode" true-value="oddDay" class="config-line__radio" :disabled="readonly">
                                              Every:
                                          </or-radio>
                                          <div class="config-line__dimansion">odd day</div>
                                      </div>
                                  </div>
                              </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
              </template>
              <template slot="item2">
                  <div placeholderItem="Set recurring daily" titleItem="Weekly">
                    <div class="schedule-step__recuring-configs">
                      <div class="wr-config-event">
                      <div class="recuring-configs__weekly">
                        <div class="tab-wrapper section-border">
                            <div class="config-line recuring-configs__weekly-day_input">
                                <div class="config-line__label">Every week on:</div>
                            </div>
                            <div class="recuring-configs__weekly-day__group">
                                <button :class="['btn-group', {'is-active': isWeekBtnActive(day), 'is-disabled': readonly }]" v-for="day in getWeekDays"
                                    :disabled="readonly" @click="toggleWeeklyDays(day)">
                                    {{day.label}}
                                </button>
                            </div>
                        </div>
                      </div>
                      </div>
                    </div>
                  </div>
              </template>
              <template slot="item3">
                  <div placeholderItem="Set recurring daily" titleItem="Monthly">
                    <div class="schedule-step__recuring-configs">
                      <div class="wr-config-event">
                        <div class="recuring-configs__monthly">
                            <div class="tab-wrapper section-border">
                                <div class="schedule-step__month-picker-wrapper">
                                    <div class="schedule-step__month-picker-active">
                                        <or-checkbox v-model="isEveryMonth" :disabled="readonly">every month</or-checkbox>
                                    </div>
                                    <month-picker v-model="monthlySelectedMonths" :disabled="readonly"></month-picker>
                                </div>
                                <div class="recuring-configs__monthly-day_configs">
                                    <div class="config-line">
                                        <or-radio v-model="isMonthlyDays" true-value="true" :disabled="!monthlySelectedMonths.length || readonly" class="config-line__radio">On the following days
                                        </or-radio>
                                        <div class="recuring-configs__monthly-day_configs-calendar" v-if="isMonthlyDays === 'true'">
                                            <div :class="['month-calendar', {'month-calendar-invalid' : !monthlySchedule.isMonthlyDaysValid}]">
                                                <div v-for="day in getMonthDays" class="month-calendar__day">
                                                    <button :class="['month-calendar__day-value', {'is-active': isMonthBtnActive(day)}]" :disabled="readonly" @click="toggleMonthDays(day)">
                                                        {{day}}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="config-line">
                                        <or-radio v-model="isMonthlyDays" true-value="false" :disabled="!monthlySelectedMonths.length || readonly" class="config-line__radio">Day periods
                                        </or-radio>
                                        <div class="monthly-periods" v-if="isMonthlyDays === 'false'">
                                            <div class="config-line__label">one the:</div>
                                            <or-select :disabled="readonly" :class="['config-line__select', {'select-box-error': !monthlySchedule.daysPeriod.period}]"
                                                label="" placeholder="" @change="monthlyDaysPeriodChange" v-model="monthlySchedule.daysPeriod.period"
                                                :options="getDaysPeriod">
                                            </or-select>
                                            <or-select :disabled="readonly" :class="['config-line__select', {'select-box-error': !monthlySchedule.daysPeriod.day}]" label=""
                                                placeholder="" @change="monthlyDaysPeriodChange" v-model="monthlySchedule.daysPeriod.day"
                                                :options="getWeekDays">
                                            </or-select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                      </div>
                    </div>
                  </div>
              </template>
              <template slot="item4">
                  <div placeholderItem="Set recurring daily" titleItem="Yearly">
                    <div class="schedule-step__recuring-configs">
                      <div class="wr-config-event">
                        <div class="recuring-configs__monthly">
                            <div class="tab-wrapper section-border">
                                <div class="schedule-step__month-picker-wrapper">
                                    <div class="schedule-step__month-picker-active">
                                        <or-checkbox v-model="isEveryMonth" :disabled="readonly">every month</or-checkbox>
                                    </div>
                                    <month-picker v-model="monthlySelectedMonths" :disabled="readonly"></month-picker>
                                </div>
                                <div class="recuring-configs__monthly-day_configs">
                                    <div class="config-line">
                                        <or-radio v-model="isMonthlyDays" true-value="true" :disabled="!monthlySelectedMonths.length || readonly" class="config-line__radio">On the following days
                                        </or-radio>
                                        <div class="recuring-configs__monthly-day_configs-calendar" v-if="isMonthlyDays === 'true'">
                                            <div :class="['month-calendar', {'month-calendar-invalid' : !monthlySchedule.isMonthlyDaysValid}]">
                                                <div v-for="day in getMonthDays" class="month-calendar__day">
                                                    <button :class="['month-calendar__day-value', {'is-active': isMonthBtnActive(day)}]" :disabled="readonly" @click="toggleMonthDays(day)">
                                                        {{day}}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="config-line">
                                        <or-radio v-model="isMonthlyDays" true-value="false" :disabled="!monthlySelectedMonths.length || readonly" class="config-line__radio">Day periods
                                        </or-radio>
                                        <div class="monthly-periods" v-if="isMonthlyDays === 'false'">
                                            <div class="config-line__label">one the:</div>
                                            <or-select :disabled="readonly" :class="['config-line__select', {'select-box-error': !monthlySchedule.daysPeriod.period}]"
                                                label="" placeholder="" @change="monthlyDaysPeriodChange" v-model="monthlySchedule.daysPeriod.period"
                                                :options="getDaysPeriod">
                                            </or-select>
                                            <or-select :disabled="readonly" :class="['config-line__select', {'select-box-error': !monthlySchedule.daysPeriod.day}]" label=""
                                                placeholder="" @change="monthlyDaysPeriodChange" v-model="monthlySchedule.daysPeriod.day"
                                                :options="getWeekDays">
                                            </or-select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                      </div>
                    </div>
                  </div>
              </template>
          </accordion>
            <!-- <div class="schedule-step__recuring-configs">
                <div class="wr-config-event">
                    <div class="recuring-configs__daily">
                        <div class="tab-wrapper section-border">
                            <div class="recuring-configs__daily-date">
                                <div class="sub-title">Set date:</div>
                                <div class="recuring-configs__daily-date__section">
                                    <div class="config-line">
                                        <or-radio v-model="dailyPeriodMode" true-value="everyDay" class="config-line__radio" :disabled="readonly">
                                            Every:
                                        </or-radio>
                                        <or-textbox :disabled="readonly || dailyPeriodMode !== 'everyDay'" :class="['xs-input', {'text-box-error': !dailySchedule.isDailyDaysValid}]"
                                            label="" v-model="displayDailyDays" placeholder="">
                                        </or-textbox>
                                        <div class="config-line__dimansion">day(s)</div>
                                    </div>
                                    <div class="config-line">
                                        <or-radio v-model="dailyPeriodMode" true-value="evenDay" class="config-line__radio" :disabled="readonly">
                                            Every:
                                        </or-radio>
                                        <div class="config-line__dimansion">even day</div>
                                    </div>
                                    <div class="config-line">
                                        <or-radio v-model="dailyPeriodMode" true-value="oddDay" class="config-line__radio" :disabled="readonly">
                                            Every:
                                        </or-radio>
                                        <div class="config-line__dimansion">odd day</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="tab-wrapper">
                            <div class="sub-title">Set time:</div>
                            <div class="recuring-configs__daily-time">
                                <div class="config-line">
                                    <or-radio v-model="isDailyRepeatTime" true-value="true" :disabled="(!displayDailyDays && dailyPeriodMode === 'everyDay') || readonly"
                                        class="config-line__radio">Repeat:
                                    </or-radio>
                                    <or-textbox label="" placeholder="00" :class="['xs-input', {'text-box-error': !dailySchedule.isDailyRepeatTimeValid && isDailyRepeatTime === 'true'}]"
                                        :disabled="(!displayDailyDays && dailyPeriodMode === 'everyDay') || isDailyRepeatTime !== 'true' || readonly"
                                        v-model="displayDailyRepeat">
                                    </or-textbox>
                                    <or-select :disabled="(!displayDailyDays && dailyPeriodMode === 'everyDay') || isDailyRepeatTime !== 'true' || readonly"
                                        label="" class="dimention-selector" :options="[{value:'hh', label:'hr'}, {value:'mm', label:'min'}]"
                                        v-model="displayDailyRepeatPeriod">
                                    </or-select>
                                </div>
                                <div class="config-line wrap">
                                    <or-radio v-model="isDailyRepeatTime" true-value="false" :disabled="(!displayDailyDays && dailyPeriodMode === 'everyDay') || readonly"
                                        class="config-line__radio">Run at:
                                    </or-radio>
                                    <div v-for="(runTime, index) in runAtTimeLocal" class="time-selector-group">
                                        <or-textbox label="" placeholder="00:00" :class="['md-input', {'text-box-error': !runTime.isValid && isDailyRepeatTime === 'false'}]"
                                            :disabled="(!displayDailyDays && dailyPeriodMode === 'everyDay') || isDailyRepeatTime !== 'false' || readonly"
                                            @change="dailyRunAtChange(runTime)" v-model='runTime.time'>
                                        </or-textbox>
                                        <or-select :disabled="(!displayDailyDays && dailyPeriodMode === 'everyDay') || isDailyRepeatTime !== 'false' || readonly"
                                            label="" class="dimention-selector" :options="[{value:'PM', label:'pm'}, {value:'AM', label:'am'}]"
                                            @change="dailyRunAtChange(runTime)" v-model="runTime.period">
                                        </or-select>
                                        <or-icon-button v-if="index !== 0 && !readonly" @click="removeRuntAtItem(runAtTimeLocal, index)" class="remove-time-btn"
                                            icon="clear" size="small" disable-ripple>
                                        </or-icon-button>
                                    </div>
                                    <button v-if="!readonly" :class="['button-link', { 'is-disabled': isDailyRepeatTime !== 'false' }]" @click="addNewDailyRunAt"
                                        :disabled="isDailyRepeatTime !== 'false' || readonly">
                                        + set time
                                    </button>
                                </div>
                            </div>
                        </div>   
                    </div>
                    <div class="recuring-configs__weekly">
                        <div class="tab-wrapper section-border">
                            <div class="sub-title">Set date:</div>
                            <div class="config-line recuring-configs__weekly-day_input">
                                <div class="config-line__label">Every week on:</div>
                            </div>
                            <div class="recuring-configs__weekly-day__group">
                                <button :class="['btn-group', {'is-active': isWeekBtnActive(day), 'is-disabled': readonly }]" v-for="day in getWeekDays"
                                    :disabled="readonly" @click="toggleWeeklyDays(day)">
                                    {{day.label}}
                                </button>
                            </div>
                        </div>

                        <div class="tab-wrapper">
                            <div class="sub-title">Set time:</div>
                            <div class="recuring-configs__daily-time">
                                <div class="config-line">
                                    <or-radio v-model="isWeeklyRepeatTime" true-value="true" :disabled="!weeklySchedule.weekDays.length || readonly" class="config-line__radio">Repeat:
                                    </or-radio>
                                    <or-textbox name="reccuring" label="" placeholder="00" :class="['xs-input', {'text-box-error': !weeklySchedule.isWeeklyRepeatTimeValid && isWeeklyRepeatTime === 'true'}]"
                                        :disabled="!weeklySchedule.weekDays.length || isWeeklyRepeatTime !== 'true' || readonly"
                                        v-model="displayWeeklyRepeat">
                                    </or-textbox>
                                    <or-select :disabled="!weeklySchedule.weekDays.length || isWeeklyRepeatTime !== 'true' || readonly" label="" class="dimention-selector"
                                        :options="[{value:'hh', label:'hr'}, {value:'mm', label:'min'}]" v-model="displayWeeklyRepeatPeriod">
                                    </or-select>
                                </div>
                                <div class="config-line wrap">
                                    <or-radio v-model="isWeeklyRepeatTime" true-value="false" :disabled="!weeklySchedule.weekDays.length || readonly" class="config-line__radio">Run at:
                                    </or-radio>
                                    <div v-for="(runTime, index) in runAtTimeLocal" class="time-selector-group">
                                        <or-textbox label="" placeholder="00:00" :class="['md-input', {'text-box-error': !runTime.isValid && isWeeklyRepeatTime === 'false'}]"
                                            :disabled="!weeklySchedule.weekDays.length || isWeeklyRepeatTime !== 'false' || readonly"
                                            @change="weeklyRunAtChange(runTime)" v-model="runTime.time">
                                        </or-textbox>
                                        <or-select :disabled="!weeklySchedule.weekDays.length || isWeeklyRepeatTime !== 'false' || readonly" label="" class="dimention-selector"
                                            :options="[{value:'PM', label:'pm'}, {value:'AM', label:'am'}]" @change="weeklyRunAtChange(runTime)"
                                            v-model="runTime.period">
                                        </or-select>
                                        <or-icon-button v-if="index !== 0 && !readonly" @click="removeRuntAtItem(runAtTimeLocal, index)" class="remove-time-btn"
                                            icon="clear" size="small" disable-ripple>
                                        </or-icon-button>
                                    </div>
                                    <button v-if="!readonly" :class="['button-link', { 'is-disabled': isWeeklyRepeatTime !== 'false' }]" @click="addNewWeeklyRunAt"
                                        :disabled="isWeeklyRepeatTime !== 'false' || readonly">
                                        + set time
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="recuring-configs__monthly">
                        <div class="tab-wrapper section-border">
                            <div class="sub-title">Set date:</div>
                            <div class="schedule-step__month-picker-wrapper">
                                <div class="schedule-step__month-picker-active">
                                    <or-checkbox v-model="isEveryMonth" :disabled="readonly">every month</or-checkbox>
                                </div>
                                <month-picker v-model="monthlySelectedMonths" :disabled="readonly"></month-picker>
                            </div>
                            <div class="recuring-configs__monthly-day_configs">
                                <div class="config-line">
                                    <or-radio v-model="isMonthlyDays" true-value="true" :disabled="!monthlySelectedMonths.length || readonly" class="config-line__radio">On the following days
                                    </or-radio>
                                    <div class="recuring-configs__monthly-day_configs-calendar" v-if="isMonthlyDays === 'true'">
                                        <div :class="['month-calendar', {'month-calendar-invalid' : !monthlySchedule.isMonthlyDaysValid}]">
                                            <div v-for="day in getMonthDays" class="month-calendar__day">
                                                <button :class="['month-calendar__day-value', {'is-active': isMonthBtnActive(day)}]" :disabled="readonly" @click="toggleMonthDays(day)">
                                                    {{day}}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="config-line">
                                    <or-radio v-model="isMonthlyDays" true-value="false" :disabled="!monthlySelectedMonths.length || readonly" class="config-line__radio">Day periods
                                    </or-radio>
                                    <div class="monthly-periods" v-if="isMonthlyDays === 'false'">
                                        <div class="config-line__label">one the:</div>
                                        <or-select :disabled="readonly" :class="['config-line__select', {'select-box-error': !monthlySchedule.daysPeriod.period}]"
                                            label="" placeholder="" @change="monthlyDaysPeriodChange" v-model="monthlySchedule.daysPeriod.period"
                                            :options="getDaysPeriod">
                                        </or-select>
                                        <or-select :disabled="readonly" :class="['config-line__select', {'select-box-error': !monthlySchedule.daysPeriod.day}]" label=""
                                            placeholder="" @change="monthlyDaysPeriodChange" v-model="monthlySchedule.daysPeriod.day"
                                            :options="getWeekDays">
                                        </or-select>
                                    </div>
                                </div>
                            </div>

                        </div>
                        <div class="tab-wrapper">
                            <div class="sub-title">Set time:</div>
                            <div class="">
                                <div class="config-line">
                                    <or-radio v-model="isMonthlyRepeatTime" true-value="true" :disabled="!monthlySelectedMonths.length || !monthlySchedule.monthDays.length && (!monthlySchedule.daysPeriod.period || !monthlySchedule.daysPeriod.day) || readonly"
                                        class="config-line__radio">Repeat:
                                    </or-radio>
                                    <or-textbox name="" label="" placeholder="00" :class="['xs-input', {'text-box-error': !monthlySchedule.isMonthlyRepeatTimeValid && isMonthlyRepeatTime === 'true'}]"
                                        :disabled="!monthlySelectedMonths.length || isMonthlyRepeatTime !== 'true' || readonly"
                                        v-model="displayMonthlyRepeat">
                                    </or-textbox>
                                    <or-select :disabled="!monthlySelectedMonths.length || isMonthlyRepeatTime !== 'true' || readonly" label="" class="dimention-selector"
                                        :options="[{value:'hh', label:'hr'}, {value:'mm', label:'min'}]" v-model="displayMonthlyRepeatPeriod">
                                    </or-select>
                                </div>
                                <div class="config-line wrap">
                                    <or-radio v-model="isMonthlyRepeatTime" true-value="false" :disabled="!monthlySelectedMonths.length || !monthlySchedule.monthDays.length && (!monthlySchedule.daysPeriod.period || !monthlySchedule.daysPeriod.day) || readonly"
                                        class="config-line__radio">Run at:
                                    </or-radio>
                                    <div v-for="(runTime, index) in runAtTimeLocal" class="time-selector-group">
                                        <or-textbox label="" placeholder="00:00" :class="['md-input', {'text-box-error': !runTime.isValid && isMonthlyRepeatTime === 'false'}]"
                                            :disabled="!monthlySelectedMonths.length || isMonthlyRepeatTime !== 'false' || readonly"
                                            @change="monthlyRunAtChange(runTime)" v-model="runTime.time">
                                        </or-textbox>
                                        <or-select :disabled="!monthlySelectedMonths.length || isMonthlyRepeatTime !== 'false' || readonly" label="" class="dimention-selector"
                                            :options="[{value:'PM', label:'pm'}, {value:'AM', label:'am'}]" @change="monthlyRunAtChange(runTime)"
                                            v-model="runTime.period">
                                        </or-select>
                                        <or-icon-button v-if="index !== 0 && !readonly" @click="removeRuntAtItem(runAtTimeLocal, index)" class="remove-time-btn"
                                            icon="clear" size="small" disable-ripple>
                                        </or-icon-button>
                                    </div>
                                    <button v-if="!readonly" :class="['button-link', { 'is-disabled': isMonthlyRepeatTime !== 'false' }]" @click="addNewMonthlyRunAt"
                                        :disabled="isMonthlyRepeatTime !== 'false' || readonly">
                                        + set time
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div> -->
        </div>
    </div>
    <div class="schedule-step__next-run">
        <div class="schedule-step__next-run-title">5 nearest scheduled starts:</div>
        <div class="next-run__section">
            <div class="next-run__section-item" v-for="item in nextRuns">{{item}}</div>
            <div class="next-run__section-item" v-if='!nextRuns.length'>N/A</div>
        </div>
    </div>
</div>
</template>


<script>
import * as _ from 'lodash';
console.log('123', _);
import moment from 'moment-timezone';
import later from 'later';
import Accordion from './Accordion/Accordion.vue';

const libs = {};
libs.moment = moment;
libs.later = later;

/* eslint-disable */
import MonthPicker from './MonthPicker.vue';
/* eslint-enable */

export default {
  watch: {
    times: {
      handler(newVal) {
        this.$emit('update:times', newVal);
        this.runAtTimeLocal = [];
        this.generateCronExpression();
        _.forEach(newVal, item => {
          if (item.start.HH && item.start.mm) {
            const addVal = item.every.units === 'hh' ? 'hours' : 'minutes';

            let nextRunAtTime = libs
              .moment(`${item.start.HH}:${item.start.mm}`, ['HH:mm'])
              .format('h:mm A');
            const endTimeHmmA = libs
              .moment(`${item.end.HH}:${item.end.mm}`, ['HH:mm'])
              .format('h:mm A');

            do {
              const splitNextRunAtTime = nextRunAtTime.split(' ');
              this.runAtTimeLocal.push({
                time: splitNextRunAtTime[0],
                period: splitNextRunAtTime[1],
                isValid: true,
              });
              this.dailyRunAtChange(
                this.runAtTimeLocal[this.runAtTimeLocal.length - 1],
              );
              this.weeklyRunAtChange(
                this.runAtTimeLocal[this.runAtTimeLocal.length - 1],
              );
              this.monthlyRunAtChange(
                this.runAtTimeLocal[this.runAtTimeLocal.length - 1],
              );
              nextRunAtTime = libs
                .moment(nextRunAtTime, ['h:mm A'])
                .add(parseInt(item.every.val, 10), addVal)
                .format('h:mm A');
            } while (
              moment(nextRunAtTime, 'h:mma').isSameOrBefore(
                moment(endTimeHmmA, 'h:mma'),
              ) &&
              item.end.HH &&
              item.end.mm
            );
          }
        });
        // this.runAtTimeLocal = this.runAtTimeLocal;
        // this.$set(this.dailySchedule, 'dailyRunAtTime', this.runAtTimeLocal);

        // console.log('this.times', this.times);
        // console.log('this.runAtTimeLocal', this.runAtTimeLocal);
      },
      deep: true,
    },
  },
  props: {
    readonly: {
      type: Boolean,
      default: false,
    },
    startExpression: {
      type: Object,
      default: () => ({
        time: '00:00',
        date: '',
      }),
    },
    deactivateAfterLastRun: {
      type: Boolean,
      default: false,
    },
    isReccuring: {
      type: Boolean,
      default: false,
    },
    expressions: {
      type: Array,
      default: () => [],
    },

    isEndTime: {
      type: Boolean,
      default: false,
    },
    includeEndTime: {
      type: Boolean,
      default: false,
    },
    endExpression: {
      time: '00:00',
      date: '',
    },
    timeZone: {
      type: Object,
      default: () => ({}),
    },
    daily: {
      type: Object,
      default: () => ({}),
    },
    weekly: {
      type: Object,
      default: () => ({}),
    },
    monthly: {
      type: Object,
      default: () => ({}),
    },
    steps: null,
    stepId: null,
    $v: null,
    times: {
      type: Array,
      default: () => [],
    },
    // runAtTime: {
    //   type: Array,
    //   default: () => [],
    // },
    // startDay: {
    //   type: String,
    //   default: null,
    // },
    editableEventNum: {
      type: Number,
      default: null,
    },
  },
  template: `<%= scheduledEventHtml %>`,
  data() {
    return {
      nextRuns: [],
      dailySchedule: {
        dailyRepeatTime: { time: '', period: 'mm' },
        dailyRunAtTime: [{ time: '', period: 'PM', isValid: true }],
        isDailyDaysValid: true,
        isDailyRepeatTimeValid: true,
      },
      weeklySchedule: {
        weekDays: [],
        weeklyRepeatTime: { time: '', period: 'mm' },
        weeklyRunAtTime: [{ time: '', period: 'PM', isValid: true }],
        isWeeklyRepeatTimeValid: true,
      },
      monthlySchedule: {
        monthDays: [],
        daysPeriod: { period: '', day: '' },
        monthlyRepeatTime: { time: '', period: 'mm' },
        monthlyRunAtTime: [{ time: '', period: 'PM', isValid: true }],
        isMonthlyDaysValid: true,
        isMonthlyRepeatTimeValid: true,
      },
      isStartDateValid: true,
      isStartTimeValid: true,
      isEndTimeValid: true,
      currDate: new Date(),
      runAtTimeLocal: [],
    };
  },

  computed: {
    startDate: {
      get() {
        const date = _.get(this.startExpression, 'date');
        // console.log('date', date);
        // console.log('startDay', this.startDay);

        const startTime = !_.isEmpty(this.startTime)
          ? libs.moment(this.startTime, 'HH:mm').format('HH:mm')
          : '00:00';
        // console.log(new Date(date + ' ' + startTime));
        return date ? new Date(date + ' ' + startTime) : null;
        // console.log('new Date(date + \' \' + startTime)', new Date(date + ' ' + startTime));
        // console.log('new Date(date)', new Date(date));
        // return date ? new Date(date) : null;
      },
      set(newValue) {
        // console.log(newValue);
        const date = new Date(newValue);
        const timeZone = libs.moment.tz.guess();
        // console.log('this.startExpression', this.startExpression);
        this.startExpression.date = libs
          .moment(date)
          .tz(timeZone)
          .format('YYYY-MM-DD');
        this.generateCronExpression(); // update crons when data changed
        this.validateStartDate();
      },
    },

    startTime: {
      get() {
        return _.get(
          this.startExpression,
          'time',
          libs.moment().format('HH:mm'),
        );
      },
      set(newValue) {
        this.startExpression.time = newValue;
        this.generateCronExpression(); // update crons when data changed
        this.validateStartEndTime();
      },
    },

    objectStartTime: {
      get() {
        const [HH, mm] = this.startTime.split(':');

        return { HH, mm };
      },
      set(newValue) {
        if (this.readonly) {
          this.startTime = `${this.startTime}`;
        } else {
          this.startTime = `${newValue.HH}:${newValue.mm}`;
        }
      },
    },

    endDate: {
      get() {
        const date = _.get(this.endExpression, 'date');
        return date ? new Date(date) : null;
      },
      set(newValue) {
        const date = new Date(newValue);

        // console.log('this.endExpression', this.endExpression);
        this.endExpression.date = libs.moment(date).format('YYYY-MM-DD');
        this.generateCronExpression(); // update crons when data changed
      },
    },

    endTime: {
      get() {
        return _.get(this.endExpression, 'time', '00:00');
      },
      set(newValue) {
        this.endExpression.time = newValue;
        this.generateCronExpression(); // update crons when data changed
        this.validateStartEndTime();
      },
    },

    objectEndTime: {
      get() {
        const [HH, mm] = this.endTime.split(':');

        return { HH, mm };
      },
      set(newValue) {
        if (this.readonly) {
          this.endTime = `${this.endTime}`;
        } else {
          this.endTime = `${newValue.HH}:${newValue.mm}`;
        }
      },
    },

    isDeactivateAfterLastRunToggled: {
      get() {
        return this.deactivateAfterLastRun;
      },

      set(newValue) {
        this.$emit('update:deactivateAfterLastRun', newValue);
      },
    },

    isReccuringChecked: {
      get() {
        return this.isReccuring;
      },
      set(newValue) {
        this.$emit('update:isReccuring', newValue);
        // delete all setting if checkbox uncheked
        if (!newValue) {
          this.resetRecurringData();
        }

        // update crons when data changed
        this.$nextTick(this.generateCronExpression);
      },
    },

    isEndChecked: {
      get() {
        return this.isEndTime;
      },
      set(newValue) {
        // if end day unchecked - clear date
        if (!newValue) {
          // direct mutation
          _.set(this.endExpression, 'date', '');
          _.set(this.endExpression, 'time', '00:00');
          this.isIncludedEndTime = false;
        }
        this.$emit('update:isEndTime', newValue);
        this.generateCronExpression(); // update crons when data changed
      },
    },

    isIncludedEndTime: {
      get() {
        return this.includeEndTime;
      },
      set(newValue) {
        this.$emit('update:includeEndTime', newValue);
        this.$nextTick(this.getNextTimeRunUI);
      },
    },

    displayDailyDays: {
      get() {
        return _.get(this.daily, 'days', '');
      },
      set(newValue) {
        // direct mutation
        this.$set(this.daily, 'days', newValue);
        // if empty reset set time section
        if (!newValue) {
          this.isDailyRepeatTime = '';
        }

        this.validateDailyTab();
        this.generateCronExpression(); // update crons when data changed
      },
    },

    dailyPeriodMode: {
      get() {
        return _.get(this.daily, 'dailyPeriodMode') || 'everyDay';
      },
      set(newValue) {
        // direct mutation
        this.$set(this.daily, 'dailyPeriodMode', newValue);
        if (newValue !== 'everyDay') {
          this.$set(this.daily, 'days', '');
        } else {
          this.isDailyRepeatTime = '';
        }

        this.validateDailyTab();
        this.generateCronExpression(); // update crons when data changed
      },
    },

    displayDailyRepeat: {
      get() {
        return this.dailySchedule.dailyRepeatTime.time;
      },
      set(newValue) {
        this.dailySchedule.dailyRepeatTime.time = newValue;
        // sync data with store
        this.daily.dailyRepeatTime = this.dailySchedule.dailyRepeatTime;
        this.validateDailyTab();
        this.$nextTick(() => {
          this.generateCronExpression(); // update crons when data changed
        });
      },
    },

    displayDailyRepeatPeriod: {
      get() {
        return this.dailySchedule.dailyRepeatTime.period;
      },
      set(newValue) {
        this.dailySchedule.dailyRepeatTime.period = newValue;
        // sync data with store
        this.daily.dailyRepeatTime = this.dailySchedule.dailyRepeatTime;
        this.validateDailyTab();
        this.$nextTick(() => {
          this.generateCronExpression(); // update crons when data changed
        });
      },
    },

    isDailyRepeatTime: {
      get() {
        return _.get(this.daily, 'isDailyRepeatTime', '');
      },
      set(newValue) {
        // direct mutation
        this.$set(this.daily, 'isDailyRepeatTime', newValue);

        // reset fields based on selection
        const templateRunAt = [{ time: '', period: 'PM', isValid: true }];
        const templateRepeat = { time: '', period: 'mm' };
        switch (newValue) {
          case 'true':
            this.runAtTimeLocal = templateRunAt;
            this.daily.dailyRunAtTime = templateRunAt;
            break;
          case 'false':
            this.dailySchedule.dailyRepeatTime = templateRepeat;
            this.daily.dailyRepeatTime = templateRepeat;
            this.dailyRunAtChange(_.head(this.runAtTimeLocal));
            break;
          default:
            this.dailySchedule.dailyRepeatTime = templateRepeat;
            this.daily.dailyRepeatTime = templateRepeat;
            this.runAtTimeLocal = templateRunAt;
            this.daily.dailyRunAtTime = templateRunAt;
        }

        this.validateDailyTab();
      },
    },

    displayWeeklyRepeat: {
      get() {
        return this.weeklySchedule.weeklyRepeatTime.time;
      },
      set(newValue) {
        this.weeklySchedule.weeklyRepeatTime.time = newValue;
        // sync data with store
        this.weekly.weeklyRepeatTime = this.weeklySchedule.weeklyRepeatTime;
        this.validateWeeklyTab();
        this.$nextTick(() => {
          this.generateCronExpression(); // update crons when data changed
        });
      },
    },

    displayWeeklyRepeatPeriod: {
      get() {
        return this.weeklySchedule.weeklyRepeatTime.period;
      },
      set(newValue) {
        this.weeklySchedule.weeklyRepeatTime.period = newValue;
        // sync data with store
        this.weekly.weeklyRepeatTime = this.weeklySchedule.weeklyRepeatTime;
        this.validateWeeklyTab();
        this.$nextTick(() => {
          this.generateCronExpression(); // update crons when data changed
        });
      },
    },

    isWeeklyRepeatTime: {
      get() {
        return _.get(this.weekly, 'isWeeklyRepeatTime', '');
      },
      set(newValue) {
        // direct mutation
        this.$set(this.weekly, 'isWeeklyRepeatTime', newValue);

        // reset fields based on selection
        const templateRunAt = [{ time: '', period: 'PM', isValid: true }];
        const templateRepeat = { time: '', period: 'mm' };
        switch (newValue) {
          case 'true':
            this.runAtTimeLocal = templateRunAt;
            this.weekly.weeklyRunAtTime = templateRunAt;
            break;
          case 'false':
            this.weeklySchedule.weeklyRepeatTime = templateRepeat;
            this.weekly.weeklyRepeatTime = templateRepeat;
            this.weeklyRunAtChange(_.head(this.runAtTimeLocal));
            break;
          default:
            this.weeklySchedule.weeklyRepeatTime = templateRepeat;
            this.weekly.weeklyRepeatTime = templateRepeat;
            this.runAtTimeLocal = templateRunAt;
            this.weekly.weeklyRunAtTime = templateRunAt;
        }

        this.validateWeeklyTab();
      },
    },

    monthlySelectedMonths: {
      get() {
        return _.get(this.monthly, 'selectedMonths') || [];
      },
      set(newValue) {
        if (
          !(_.get(this.monthly, 'selectedMonths') || []).length &&
          newValue.length
        ) {
          this.isMonthlyDays = 'true';
        }
        // direct mutation
        this.$set(this.monthly, 'selectedMonths', newValue);
        if (!newValue.length) {
          this.isMonthlyDays = '';
          this.isMonthlyRepeatTime = '';
        }

        this.$nextTick(() => {
          if (this.isMonthlyDays === 'true') {
            this.monthly.monthDays = _.reject(
              this.monthly.monthDays,
              date => !_.includes(this.getMonthDays, date),
            );
            this.monthlySchedule.monthDays = this.monthly.monthDays;
          }

          this.validateMonthlyTab();
          this.generateCronExpression(); // update crons when data changed
        });
      },
    },

    isEveryMonth: {
      get() {
        return this.monthlySelectedMonths.length === 12; // HARD CODE
      },
      set(newValue) {
        // direct mutation
        if (newValue) {
          if (!(_.get(this.monthly, 'selectedMonths') || []).length) {
            this.isMonthlyDays = 'true';
          }
          this.$set(
            this.monthly,
            'selectedMonths',
            Array.apply(null, { length: 12 }).map((_, index) => index + 1),
          ); // HARD CODE
          this.validateMonthlyTab();
        }
      },
    },

    isMonthlyDays: {
      get() {
        return _.get(this.monthly, 'isMonthlyDays', '');
      },
      set(newValue) {
        // direct mutation
        this.$set(this.monthly, 'isMonthlyDays', newValue);
        if (newValue === 'true') {
          const template = { day: '', period: '' };
          this.monthly.daysPeriod = template;
          this.monthlySchedule.daysPeriod = template;
        } else {
          this.monthly.monthDays = [];
          this.monthlySchedule.monthDays = [];
        }
        this.validateMonthlyTab();
      },
    },

    displayMonthlyRepeat: {
      get() {
        return this.monthlySchedule.monthlyRepeatTime.time;
      },
      set(newValue) {
        this.monthlySchedule.monthlyRepeatTime.time = newValue;
        // sync data with store
        this.monthly.monthlyRepeatTime = this.monthlySchedule.monthlyRepeatTime;
        this.validateMonthlyTab();
        this.$nextTick(() => {
          this.generateCronExpression(); // update crons when data changed
        });
      },
    },

    displayMonthlyRepeatPeriod: {
      get() {
        return this.monthlySchedule.monthlyRepeatTime.period;
      },
      set(newValue) {
        this.monthlySchedule.monthlyRepeatTime.period = newValue;
        // sync data with store
        this.monthly.monthlyRepeatTime = this.monthlySchedule.monthlyRepeatTime;
        this.validateMonthlyTab();
        this.$nextTick(() => {
          this.generateCronExpression(); // update crons when data changed
        });
      },
    },

    isMonthlyRepeatTime: {
      get() {
        return _.get(this.monthly, 'isMonthlyRepeatTime', '');
      },
      set(newValue) {
        // direct mutation
        this.$set(this.monthly, 'isMonthlyRepeatTime', newValue);

        // reset fields based on selection
        const templateRunAt = [{ time: '', period: 'PM', isValid: true }];
        const templateRepeat = { time: '', period: 'mm' };
        switch (newValue) {
          case 'true':
            this.monthly.monthlyRunAtTime = templateRunAt;
            this.runAtTimeLocal = templateRunAt;
            break;
          case 'false':
            this.monthly.monthlyRepeatTime = templateRepeat;
            this.monthlySchedule.monthlyRepeatTime = templateRepeat;
            this.monthlyRunAtChange(_.head(this.runAtTimeLocal));
            break;
          default:
            this.monthly.monthlyRepeatTime = templateRepeat;
            this.monthlySchedule.monthlyRepeatTime = templateRepeat;
            this.monthly.monthlyRunAtTime = templateRunAt;
            this.runAtTimeLocal = templateRunAt;
        }

        this.validateMonthlyTab();
      },
    },

    // TODO: get better option to get regions.
    // One of posible option is get contry and its regions
    // https://github.com/moment/moment-timezone/issues/227
    getRegions() {
      // return only canonical zones
      const timeZones = libs.moment.tz._zones;

      return _.chain(timeZones)
        .keys()
        .map(key => {
          // due to mutation in moment we need check if it's object
          // mutation is caused when invoke moment.tz()
          const zone = timeZones[key];
          return _.isObject(zone) ? zone.name : zone.split('|')[0];
        })
        .filter(zone => zone.indexOf('/') >= 0)
        .sort()
        .map(value => ({ label: value, value }))
        .value();
    },

    displayTimeZone: {
      get() {
        const timeZone = libs.moment.tz.guess();
        return _.isEmpty(this.timeZone)
          ? timeZone
          : _.get(this.timeZone, 'value', '');
      },
      set(newValue) {
        if (newValue) {
          this.$emit('update:timeZone', {
            value: newValue,
            label: newValue,
          });
          this.$nextTick(this.getNextTimeRunUI); // update UI based on new regions
        }
      },
    },

    getMonthDays() {
      return _.range(
        1,
        _.reduce(
          this.monthlySelectedMonths,
          (prev, curr) => {
            let lastDate = libs
              .moment()
              .month(curr - 1)
              .endOf('month')
              .date();

            if (curr === 2) {
              lastDate = 29;
            }

            return lastDate > prev ? lastDate : prev;
          },
          0,
        ) + 1,
      );
    },

    getDaysPeriod() {
      return [
        { label: 'every', value: '*' },
        { label: '1st', value: '1' },
        { label: '2nd', value: '2' },
        { label: '3rd', value: '3' },
        { label: '4th', value: '4' },
        { label: '5th', value: '5' },
        { label: 'last', value: 'L' },
      ];
    },

    getWeekDays() {
      return [
        { label: 'Mon', value: '1' },
        { label: 'Tue', value: '2' },
        { label: 'Wed', value: '3' },
        { label: 'Thu', value: '4' },
        { label: 'Fri', value: '5' },
        { label: 'Sat', value: '6' },
        { label: 'Sun', value: '0' },
      ];
    },
  },

  created() {
    libs.moment.tz.setDefault('Etc/UTC');

    if (_.isEmpty(this.timeZone)) {
      const timeZone = libs.moment.tz.guess();
      this.$emit('update:timeZone', { value: timeZone, label: timeZone });
    }
    if (
      !_.get(this.monthly, 'selectedMonths') &&
      _.get(this.monthly, 'month')
    ) {
      const month = parseInt(_.get(this.monthly, 'month'));
      if (month) {
        let i = 1;
        const selectedMonths = [];
        while (i <= 12) {
          selectedMonths.push(i);
          i += month;
        }
        _.set(this.monthly, 'selectedMonths', selectedMonths);
      }
    }

    this.dailySchedule.dailyRepeatTime = _.get(this.daily, 'dailyRepeatTime', {
      time: '',
      period: 'mm',
    });
    this.runAtTimeLocal = _.get(this.daily, 'dailyRunAtTime', [
      { time: '', period: 'PM', isValid: true },
    ]);

    this.weeklySchedule.weeklyRepeatTime = _.get(
      this.weekly,
      'weeklyRepeatTime',
      { time: '', period: 'mm' },
    );
    this.runAtTimeLocal = _.get(this.weekly, 'weeklyRunAtTime', [
      { time: '', period: 'PM', isValid: true },
    ]);
    this.weeklySchedule.weekDays = _.get(this.weekly, 'weekDays', []);

    this.monthlySchedule.monthlyRepeatTime = _.get(
      this.monthly,
      'monthlyRepeatTime',
      { time: '', period: 'mm' },
    );
    this.runAtTimeLocal = _.get(this.monthly, 'monthlyRunAtTime', [
      { time: '', period: 'PM', isValid: true },
    ]);
    this.monthlySchedule.monthDays = _.get(this.monthly, 'monthDays', []);
    this.monthlySchedule.daysPeriod = _.get(this.monthly, 'daysPeriod', {
      period: '',
      day: '',
    });

    this.getNextTimeRunUI();
    // validators
    this.validateStartDate();
    this.validateStartEndTime();
    this.validateDailyTab();
    this.validateWeeklyTab();
    this.validateMonthlyTab();
  },

  methods: {
    listNewItemTime() {
      return {
        start: {
          HH: '',
          mm: '',
        },
        end: {
          HH: '',
          mm: '',
        },
        every: {
          val: 10,
          units: 'mm',
        },
        endTime: false,
      };
    },

    formatDate(date) {
      const timeZone = libs.moment.tz.guess();
      return libs
        .moment(date)
        .tz(timeZone)
        .format('YYYY-MM-DD');
    },

    dailyRunAtChange(runTime) {
      // direct mutation
      this.daily.dailyRunAtTime = this.runAtTimeLocal;
      this.generateCronExpression(); // update crons when data changed

      // simple validation
      const date = libs.moment(runTime.time, 'HH:mm').format();
      runTime.isValid = date !== 'Invalid date';
    },

    removeRuntAtItem(itemsArray, index) {
      itemsArray.splice(index, 1);
      this.generateCronExpression(); // update crons when data changed
    },

    weeklyRunAtChange(runTime) {
      // direct mutation
      this.weekly.weeklyRunAtTime = this.runAtTimeLocal;
      this.generateCronExpression(); // update crons when data changed

      // simple validation
      const date = libs.moment(runTime.time, 'HH:mm').format();
      runTime.isValid = date !== 'Invalid date';
    },

    monthlyRunAtChange(runTime) {
      // direct mutation
      this.monthly.monthlyRunAtTime = this.runAtTimeLocal;
      this.generateCronExpression(); // update crons when data changed

      // simple validation
      const date = libs.moment(runTime.time, 'HH:mm').format();
      runTime.isValid = date !== 'Invalid date';
    },

    monthlyDaysPeriodChange() {
      // direct mutation
      this.monthly.daysPeriod = this.monthlySchedule.daysPeriod;
      this.generateCronExpression(); // update crons when data changed
    },

    addNewDailyRunAt() {
      this.runAtTimeLocal.push({
        time: '',
        period: 'PM',
        isValid: true,
      });
    },

    addNewWeeklyRunAt() {
      this.runAtTimeLocal.push({
        time: '',
        period: 'PM',
        isValid: true,
      });
    },

    addNewMonthlyRunAt() {
      this.runAtTimeLocal.push({
        time: '',
        period: 'PM',
        isValid: true,
      });
    },

    toggleWeeklyDays(day) {
      const index = _.findIndex(this.weeklySchedule.weekDays, weekDay => {
        return weekDay.value === day.value;
      });

      if (index !== -1) {
        this.weekly.weekDays.splice(index, 1);
      } else {
        // initialize if undefined
        if (!this.weekly.weekDays) {
          this.weekly.weekDays = [];
        }

        this.weekly.weekDays = _.concat(this.weekly.weekDays, day);
        this.weeklySchedule.weekDays = this.weekly.weekDays;
      }

      // reset radio btn if no days selected
      if (!this.weeklySchedule.weekDays.length) {
        this.isWeeklyRepeatTime = '';
      }

      this.generateCronExpression(); // update crons when data changed
    },

    toggleMonthDays(day) {
      const index = _.findIndex(this.monthlySchedule.monthDays, monthDay => {
        return monthDay === day;
      });

      if (index !== -1) {
        this.monthly.monthDays.splice(index, 1);
      } else {
        // initialize if undefined
        if (!this.monthly.monthDays) {
          this.monthly.monthDays = [];
        }

        this.monthly.monthDays = _.concat(this.monthly.monthDays, day);
        this.monthlySchedule.monthDays = this.monthly.monthDays;
      }

      this.validateMonthlyTab();
      this.generateCronExpression(); // update crons when data changed
    },

    isWeekBtnActive(day) {
      return _.find(this.weeklySchedule.weekDays, weekDay => {
        return weekDay.value === day.value;
      });
    },

    isMonthBtnActive(day) {
      return _.find(this.monthlySchedule.monthDays, monthDay => {
        return monthDay === day;
      });
    },

    getDailyCronExpressions() {
      // if error - do not generate cron
      if (
        !this.daily ||
        !this.dailySchedule.isDailyDaysValid ||
        !this.dailySchedule.isDailyRepeatTimeValid ||
        (this.dailyPeriodMode === 'everyDay' && !this.daily.days)
      ) {
        return;
      }
      const daily = _.cloneDeep(this.daily);

      try {
        // daily cron expression
        let dateStartingFromPrefix = '*';
        switch (this.dailyPeriodMode) {
          case 'oddDay':
            dateStartingFromPrefix = '1';
            break;
          case 'evenDay':
            dateStartingFromPrefix = '2';
            break;
          default:
            break;
        }

        const everyDay = `${dateStartingFromPrefix}/${daily.days || 2}`;

        // if (daily.isDailyRepeatTime === 'true' && daily.dailyRepeatTime.time) {
        //   let min = null;
        //   let hour = null;
        //   switch (daily.dailyRepeatTime.period) {
        //     case 'mm':
        //       min = `*/${daily.dailyRepeatTime.time}`;
        //       return [`${min} * ${everyDay} * *`];
        //     case 'hh':
        //       hour = `*/${daily.dailyRepeatTime.time}`;
        //       return [`0 ${hour} ${everyDay} * *`];
        //   }
        // }

        // if (daily.isDailyRepeatTime === 'false') {
        const time = [];
        _.forEach(daily.dailyRunAtTime, runTime => {
          if (runTime.time) {
            time.push(
              libs
                .moment(`${runTime.time} ${runTime.period}`, ['h:mm A'])
                .format('HH:mm'),
            );
          }
        });

        const crons = _.map(time, _time => {
          const splitedTime = _time.split(':');
          return `${splitedTime[1]} ${splitedTime[0]} ${everyDay} * *`;
        });

        return crons;
        // }

        return [`0 0 ${everyDay} * *`];
      } catch (error) {
        console.error('Could not parse daily cron', error);
        return [];
      }
    },

    getWeeklyCronExpressions() {
      // if error - do not generate cron
      if (!this.weeklySchedule.isWeeklyRepeatTimeValid) {
        return;
      }

      const weekly = _.cloneDeep(this.weekly);

      try {
        // weekly cron expression
        if (!_.isEmpty(_.get(weekly, 'weekDays'))) {
          const weekDaysJoin = _.chain(weekly.weekDays)
            .map(weekDay => weekDay.value)
            .join(',')
            .value();

          const weekDaysCron = `0 0 * * ${weekDaysJoin}`;

          // if (
          //   weekly.isWeeklyRepeatTime === 'true' &&
          //   weekly.weeklyRepeatTime.time
          // ) {
          //   let min = null;
          //   let hour = null;

          //   switch (weekly.weeklyRepeatTime.period) {
          //     case 'mm':
          //       min = `*/${weekly.weeklyRepeatTime.time}`;
          //       return `${min} * * * ${weekDaysJoin}`;
          //     case 'hh':
          //       hour = `*/${weekly.weeklyRepeatTime.time}`;
          //       return `0 ${hour} * * ${weekDaysJoin}`;
          //   }
          // }

          // if (weekly.isWeeklyRepeatTime === 'false') {
          const time = [];
          _.forEach(weekly.weeklyRunAtTime, runTime => {
            if (runTime.time) {
              time.push(
                libs
                  .moment(`${runTime.time} ${runTime.period}`, ['h:mm A'])
                  .format('HH:mm'),
              );
            }
          });

          const crons = [];
          _.forEach(time, _time => {
            const splitedTime = _time.split(':');
            crons.push(
              `${splitedTime[1]} ${splitedTime[0]} * * ${weekDaysJoin}`,
            );
          });

          return crons;
          // }

          return _.isEmpty(weekDaysCron)
            ? [] // no cron if week days not selected
            : weekDaysCron;
        }
      } catch (error) {
        console.error('Could not parse weekly cron', error);
        return [];
      }
    },

    getMonthlyCronExpressions() {
      // if (
      //   !this.monthlySchedule.isMonthlyDaysValid ||
      //   !this.monthlySchedule.isMonthlyRepeatTimeValid
      // ) {
      //   return;
      // }
      const monthly = _.cloneDeep(this.monthly);

      try {
        // monthly cron expression
        if ((_.get(monthly, 'selectedMonths') || []).length) {
          const everyMonth = monthly.selectedMonths.join(',');
          const monthDays = _.join(monthly.monthDays, ',');
          const daysPeriod = monthly.daysPeriod;

          if (monthly.isMonthlyDays === 'true' && monthDays) {
            // if (
            //   monthly.isMonthlyRepeatTime === 'true' &&
            //   monthly.monthlyRepeatTime.time
            // ) {
            //   let min = null;
            //   let hour = null;

            //   switch (_.get(monthly, 'monthlyRepeatTime.period')) {
            //     case 'mm':
            //       min = `*/${monthly.monthlyRepeatTime.time}`;
            //       return [`${min} * ${monthDays} ${everyMonth} *`];
            //     case 'hh':
            //       hour = `*/${monthly.monthlyRepeatTime.time}`;
            //       return [`0 ${hour} ${monthDays} ${everyMonth} *`];
            //   }
            // }

            // if (monthly.isMonthlyRepeatTime === 'false') {
            const time = [];
            _.forEach(monthly.monthlyRunAtTime, runTime => {
              if (runTime.time) {
                time.push(
                  libs
                    .moment(`${runTime.time} ${runTime.period}`, ['h:mm A'])
                    .format('HH:mm'),
                );
              }
            });

            const crons = _.map(time, _time => {
              const splitedTime = _time.split(':');
              return `${splitedTime[1]} ${
                splitedTime[0]
              } ${monthDays} ${everyMonth} *`;
            });

            return crons;
            // }

            return _.isEmpty(monthDays)
              ? []
              : `0 0 ${monthDays} ${everyMonth} *`;
          }

          if (
            monthly.isMonthlyDays === 'false' &&
            daysPeriod.period &&
            daysPeriod.day
          ) {
            const period = _.parseInt(daysPeriod.period)
              ? `${daysPeriod.day}#${daysPeriod.period}`
              : daysPeriod.period === '*'
                ? `${daysPeriod.day}`
                : `${daysPeriod.day}${daysPeriod.period}`;

            // if (
            //   monthly.isMonthlyRepeatTime === 'true' &&
            //   monthly.monthlyRepeatTime.time
            // ) {
            //   let min = null;
            //   let hour = null;

            //   switch (monthly.monthlyRepeatTime.period) {
            //     case 'mm':
            //       min = `*/${monthly.monthlyRepeatTime.time}`;
            //       return [`${min} * * ${everyMonth} ${period}`];
            //     case 'hh':
            //       hour = `*/${monthly.monthlyRepeatTime.time}`;
            //       return [`0 ${hour} * ${everyMonth} ${period}`];
            //   }
            // }

            // if (monthly.isMonthlyRepeatTime === 'false') {
            const time = [];
            _.forEach(monthly.monthlyRunAtTime, runTime => {
              if (runTime.time) {
                time.push(
                  libs
                    .moment(`${runTime.time} ${runTime.period}`, ['h:mm A'])
                    .format('HH:mm'),
                );
              }
            });

            const crons = _.map(time, _time => {
              const splitedTime = _time.split(':');
              return `${splitedTime[1]} ${
                splitedTime[0]
              } * ${everyMonth} ${period}`;
            });

            return crons;
            // }

            return daysPeriod.period && daysPeriod.day
              ? `0 0 * ${everyMonth} ${period}`
              : [];
          }

          return [];
        }
      } catch (error) {
        console.error('Could not parse monthly cron', error);
        return [];
      }
    },

    // save is optional arg
    generateCronExpression(save) {
      // by default emit update otherwise return generated crons w/o emit
      const updateCrons = _.isBoolean(save) ? save : true;

      const daily = this.getDailyCronExpressions();
      const weekly = this.getWeeklyCronExpressions();
      const monthly = this.getMonthlyCronExpressions();

      const crons = _.concat(daily, weekly, monthly);
      const validCrons = _.compact(crons);

      if (updateCrons) {
        this.$emit('update:expressions', validCrons);
        this.$nextTick(this.getNextTimeRunUI);
      } else {
        return validCrons;
      }
    },

    _getStartTime() {
      if (this.startDate) {
        libs.moment.tz.setDefault('Etc/UTC');

        const dateFormat = 'YYYY-MM-DD HH:mm:ss';
        // const start = libs.moment.utc(this.startDate).format('YYYY-MM-DD');
        const timeZone = libs.moment.tz.guess();
        const start = libs
          .moment(this.startDate)
          .tz(timeZone)
          .format('YYYY-MM-DD');

        var timeString = start;
        // validate entered time
        const _startTime = libs.moment(this.startTime, 'HH:mm').format('HH:mm');
        if (this.startTime && _startTime !== 'Invalid date') {
          timeString = `${start} ${_startTime}`;
        }

        const years = libs.moment(timeString).year();
        const months = libs.moment(timeString).month();
        const dates = libs.moment(timeString).date();
        const hours = libs.moment(timeString).hour();
        const minutes = libs.moment(timeString).minute();

        return this.startDate && !this.startTime
          ? libs.moment(start, dateFormat)
          : libs.moment([years, months, dates, hours, minutes]);
      }
    },

    _getEndTime() {
      libs.moment.tz.setDefault('Etc/UTC');
      if (this.endDate) {
        const dateFormat = 'YYYY-MM-DD HH:mm:ss';
        const end = libs.moment.utc(this.endDate).format('YYYY-MM-DD');

        var timeString = end;
        // validate entered time
        const _endTime = libs.moment(this.endTime, 'HH:mm').format('HH:mm');
        if (this.endTime && _endTime !== 'Invalid date') {
          timeString = `${end} ${_endTime}`;
        }

        const years = libs.moment(timeString).year();
        const months = libs.moment(timeString).month();
        const dates = libs.moment(timeString).date();
        const hours = libs.moment(timeString).hour();
        const minutes = libs.moment(timeString).minute();

        return this.endDate && !this.endTime
          ? libs.moment(end, dateFormat)
          : libs.moment([years, months, dates, hours, minutes]);
      }
    },

    _getNowInClientZone() {
      const dateFormat = 'YYYY-MM-DD HH:mm:ss';
      const nowString = libs.moment
        .tz(libs.moment.utc(), this.displayTimeZone)
        .format(dateFormat);
      return libs.moment.utc(nowString);
    },

    _getClosestTimeMs(timeStringArray) {
      return _.chain(timeStringArray)
        .map(timeString => {
          libs.moment.tz.setDefault('Etc/UTC');

          const years = libs.moment(timeString).year();
          const months = libs.moment(timeString).month();
          const dates = libs.moment(timeString).date();
          const hours = libs.moment(timeString).hour();
          const minutes = libs.moment(timeString).minute();

          return libs.moment
            .utc([years, months, dates, hours, minutes])
            .valueOf();
        })
        .filter(timeMs => {
          const endTime = this._getEndTime();
          return endTime
            ? this.isIncludedEndTime
              ? timeMs <= endTime.valueOf()
              : timeMs < endTime.valueOf()
            : true;
        })
        .sortBy()
        .value();
    },

    // methods generates next time that shown on UI
    getNextTimeRunUI() {
      const dateFormat = 'YYYY-MM-DD HH:mm:ss';
      let startTime = this._getStartTime();

      if (!startTime) {
        return;
      }

      if (this.isReccuring) {
        startTime =
          startTime.valueOf() > this._getNowInClientZone().valueOf()
            ? startTime
            : this._getNowInClientZone();
      }

      const crons = this.generateCronExpression(false);

      let cronExpressions = _.compact(this.expressions);

      if (!this.isReccuring) {
        // generte cron based on start date
        const month = startTime.format('M');
        const day = startTime.format('D');
        const hour = startTime.format('HH');
        const min = startTime.format('mm');

        const startExpression = `${min} ${hour} ${day} ${month} *`;

        cronExpressions =
          this._getNowInClientZone().valueOf() > startTime.valueOf()
            ? []
            : _.compact(_.concat(cronExpressions, startExpression));
      }

      let nextRuns = [];

      _.forEach(cronExpressions, expression => {
        libs.later.date.UTC();
        const parsedCron = libs.later.parse.cron(expression);
        const nextRunTimeString = libs.later
          .schedule(parsedCron)
          .next(5, startTime.toDate());

        if (nextRunTimeString) {
          nextRuns = _.concat(nextRuns, nextRunTimeString);
        }
      });

      const numberOfRun = this.isReccuring ? 5 : 1;
      const firstFive = _.slice(
        this._getClosestTimeMs(nextRuns),
        0,
        numberOfRun,
      );
      this.nextRuns = _.map(firstFive, timeMs => {
        return libs.moment(timeMs).format('YYYY-MM-DD, hh:mm A');
      });
    },

    resetRecurringData() {
      this.$emit('update:daily', {});
      this.$emit('update:weekly', {});
      this.$emit('update:monthly', {});

      // re-set internal data as well
      this.dailySchedule = {
        dailyRepeatTime: { time: '', period: 'mm' },
        dailyRunAtTime: [{ time: '', period: 'PM', isValid: true }],
        isDailyDaysValid: true,
        isDailyRepeatTimeValid: true,
      };
      this.weeklySchedule = {
        weekDays: [],
        weeklyRepeatTime: { time: '', period: 'mm' },
        weeklyRunAtTime: [{ time: '', period: 'PM', isValid: true }],
        isWeeklyRepeatTimeValid: true,
      };
      this.monthlySchedule = {
        monthDays: [],
        daysPeriod: { period: '', day: '' },
        monthlyRepeatTime: { time: '', period: 'mm' },
        monthlyRunAtTime: [{ time: '', period: 'PM', isValid: true }],
        isMonthlyDaysValid: true,
        isMonthlyRepeatTimeValid: true,
      };
    },

    // method validates start and end time
    validateStartEndTime() {
      // start time if not empty
      if (this.startTime) {
        const _startTime = libs.moment(this.startTime, 'HH:mm').format();
        this.isStartTimeValid = _startTime !== 'Invalid date';
      } else {
        this.isStartTimeValid = false;
      }

      // end time if not empty
      if (this.endTime) {
        const _endTime = libs.moment(this.endTime, 'HH:mm').format();
        this.isEndTimeValid = _endTime !== 'Invalid date';
      } else {
        this.isEndTimeValid = true;
      }
    },

    // method validates start date
    validateStartDate() {
      this.isStartDateValid = !!this.startDate;
    },

    // method validates all step inputes on daily tab
    validateDailyTab() {
      // dailyDays if not empty
      if (this.displayDailyDays) {
        this.dailySchedule.isDailyDaysValid =
          !_.isNaN(Number(this.displayDailyDays)) &&
          this.isPositiveNumbers(this.displayDailyDays) &&
          Number(this.displayDailyDays) > 0 &&
          Number(this.displayDailyDays) < 32;
      } else {
        this.dailySchedule.isDailyDaysValid = true;
      }

      // daily repeat time
      const dailyDemention = _.get(
        this.dailySchedule,
        'dailyRepeatTime.period',
      );
      if (this.isDailyRepeatTime === 'true') {
        switch (dailyDemention) {
          case 'mm':
            this.dailySchedule.isDailyRepeatTimeValid =
              this.isPositiveNumbers(this.displayDailyRepeat) &&
              this.displayDailyRepeat > 0 &&
              this.displayDailyRepeat < 60;
            break;
          case 'hh':
            this.dailySchedule.isDailyRepeatTimeValid =
              this.isPositiveNumbers(this.displayDailyRepeat) &&
              this.displayDailyRepeat > 0 &&
              this.displayDailyRepeat < 24;
            break;
          default:
            this.dailySchedule.isDailyRepeatTimeValid = true;
        }
      } else {
        this.dailySchedule.isDailyRepeatTimeValid = true;
      }

      // daily repeat period (min/hour)
      const dailyTime = _.get(this.dailySchedule, 'dailyRepeatTime.time');
      if (this.isDailyRepeatTime === 'true') {
        switch (this.displayDailyRepeatPeriod) {
          case 'mm':
            this.dailySchedule.isDailyRepeatTimeValid =
              this.isPositiveNumbers(dailyTime) &&
              dailyTime > 0 &&
              dailyTime < 60;
            break;
          case 'hh':
            this.dailySchedule.isDailyRepeatTimeValid =
              this.isPositiveNumbers(dailyTime) &&
              dailyTime > 0 &&
              dailyTime < 24;
            break;
          default:
            this.dailySchedule.isDailyRepeatTimeValid = true;
        }
      } else {
        this.dailySchedule.isDailyRepeatTimeValid = true;
      }
    },

    // method validates all step inputes on weekly tab
    validateWeeklyTab() {
      const weeklyDemention = _.get(
        this.weeklySchedule,
        'weeklyRepeatTime.period',
      );
      // if field selected - validate
      if (this.isWeeklyRepeatTime === 'true') {
        switch (weeklyDemention) {
          case 'mm':
            this.weeklySchedule.isWeeklyRepeatTimeValid =
              this.isPositiveNumbers(this.displayWeeklyRepeat) &&
              this.displayWeeklyRepeat > 0 &&
              this.displayWeeklyRepeat < 60;
            break;
          case 'hh':
            this.weeklySchedule.isWeeklyRepeatTimeValid =
              this.isPositiveNumbers(this.displayWeeklyRepeat) &&
              this.displayWeeklyRepeat > 0 &&
              this.displayWeeklyRepeat < 24;
            break;
          default:
            this.weeklySchedule.isWeeklyRepeatTimeValid = true;
        }
      } else {
        this.weeklySchedule.isWeeklyRepeatTimeValid = true;
      }

      const weeklyTime = _.get(this.weeklySchedule, 'weeklyRepeatTime.time');
      // if field selected - validate
      if (this.isWeeklyRepeatTime === 'true') {
        switch (this.displayWeeklyRepeatPeriod) {
          case 'mm':
            this.weeklySchedule.isWeeklyRepeatTimeValid =
              this.isPositiveNumbers(weeklyTime) &&
              weeklyTime > 0 &&
              weeklyTime < 60;
            break;
          case 'hh':
            this.weeklySchedule.isWeeklyRepeatTimeValid =
              this.isPositiveNumbers(weeklyTime) &&
              weeklyTime > 0 &&
              weeklyTime < 24;
            break;
          default:
            this.weeklySchedule.isWeeklyRepeatTimeValid = true;
        }
      } else {
        this.weeklySchedule.isWeeklyRepeatTimeValid = true;
      }
    },

    // method validates all step inputes on weekly tab
    validateMonthlyTab() {
      // validate monthly month
      if (!this.monthlySelectedMonths.length || this.isMonthlyDays !== 'true') {
        this.monthlySchedule.isMonthlyDaysValid = true;
      } else {
        this.monthlySchedule.isMonthlyDaysValid = !_.isEmpty(
          this.monthly.monthDays,
        );
      }

      // validate monthly repeat
      const monthlyDemention = _.get(
        this.monthlySchedule,
        'monthlyRepeatTime.period',
      );
      if (this.isMonthlyRepeatTime === 'true') {
        switch (monthlyDemention) {
          case 'mm':
            this.monthlySchedule.isMonthlyRepeatTimeValid =
              this.isPositiveNumbers(this.displayMonthlyRepeat) &&
              this.displayMonthlyRepeat > 0 &&
              this.displayMonthlyRepeat < 60;
            break;
          case 'hh':
            this.monthlySchedule.isMonthlyRepeatTimeValid =
              this.isPositiveNumbers(this.displayMonthlyRepeat) &&
              this.displayMonthlyRepeat > 0 &&
              this.displayMonthlyRepeat < 24;
            break;
          default:
            this.monthlySchedule.isMonthlyRepeatTimeValid = true;
        }
      } else {
        this.monthlySchedule.isMonthlyRepeatTimeValid = true;
      }

      // validate monthly repeat period
      const monthlyTime = _.get(this.monthlySchedule, 'monthlyRepeatTime.time');
      if (this.isMonthlyRepeatTime === 'true') {
        switch (this.displayMonthlyRepeatPeriod) {
          case 'mm':
            this.monthlySchedule.isMonthlyRepeatTimeValid =
              this.isPositiveNumbers(monthlyTime) &&
              monthlyTime > 0 &&
              monthlyTime < 60;
            break;
          case 'hh':
            this.monthlySchedule.isMonthlyRepeatTimeValid =
              this.isPositiveNumbers(monthlyTime) &&
              monthlyTime > 0 &&
              monthlyTime < 24;
            break;
          default:
            this.monthlySchedule.isMonthlyRepeatTimeValid = true;
        }
      } else {
        this.monthlySchedule.isMonthlyRepeatTimeValid = true;
      }
    },

    isPositiveNumbers(string) {
      const regExp = /^[0-9]*$/;
      return regExp.test(string);
    },
  },

  components: {
    MonthPicker,
    Accordion,
  },
};
</script>

<style lang="scss" rel="stylesheet/scss">
@import 'ScheduleEvent';
</style>
