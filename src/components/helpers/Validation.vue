<template>
    <div>
        <div class="validation__wr">
            <div 
                class="validation" 
                :class="{invalid: invalid}"
            >
                <span class="validation__text">{{invalid ? 'invalid' : 'valid'}}</span>
            </div>
        </div>

        <div class="validation__wr-component">
            <div class="validation__component">
                <slot></slot>
            </div>
        </div>

    </div>
</template>

<script>
export default {
  props: {
    invalid: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style lang="scss" scoped>
.validation {
  margin-top: 10px;
  width: 60px;
  transform: rotate(45deg);
  height: 60px;
  background: #64b2da;
  border-radius: 3px;
  margin: auto;
  &__wr {
    min-height: 95px;
    padding-top: 20px;
  }
  &__text {
    color: #fff;
    transform: rotate(-45deg) translate(0px, 10px);
    display: block;
  }

  &.invalid &__text {
    transform: rotate(-45deg) translate(-5px, 10px);
  }

  &.invalid {
    background: #f95d5d;
  }

  &__component {
    padding: 20px;
  }
  &__wr-component {
    border-top: 1px solid #a1a6aa;
    border-left: 1px solid #a1a6aa;
    border-right: 1px solid #a1a6aa;
    // transform: translateY(23px);
  }
}
</style>
