<template>
  <form name="booking" :class="[$style.bookingForm]">
    <h1 v-if="content?.booking_information_title?.[0]" :class="$style.title">
      {{ $prismic.asText(content.booking_information_title) }}
    </h1>

    <!-- OPTIONS -->
    <div v-if="items?.[0]?.option_title" :class="$style.bookingOptions">
      <div
        v-for="(item, index) in items"
        :key="index"
        :class="[$style.option, formData.option?.option_title === item.option_title && $style.active]"
        @click="formData.option = item"
      >
        <div :class="$style.optionTitle">{{ $prismic.asText(item.option_title) }}</div>
        <div :class="$style.optionPrice">{{ $prismic.asText(item.option_price) }}</div>
      </div>
    </div>

    <!-- DATES -->
    <div :class="$style.dates">
      <h1
        v-if="type === 'formSpecialRetreat' && content?.dates_title?.[0]"
        :class="[$style.title, $style.datesTitle]"
      >
        {{ $prismic.asText(content.dates_title) }}
      </h1>

      <RichText
        v-if="type !== 'formSpecialRetreat' && content?.dates_title?.[0]"
        :class="$style.datesDescription"
        :text="content.dates_title"
      />

      <div v-if="type !== 'formSpecialRetreat'" :class="[$style.formRow, $style.three]">
        <Input :class="$style.input" :placeholder="content.check_in_text" v-model="formData.checkIn" type="date" required />
        <Input :class="$style.input" :placeholder="content.check_out_text" v-model="formData.checkOut" type="date" required />
        <Input :class="$style.input" :placeholder="content.guests_text" v-model="formData.guests" type="tel" required />
      </div>

      <div
        v-for="(item, index) in specialDates"
        :key="index"
        :class="[$style.specialDate, item.date === formData.date && $style.active, item.space < 1 && $style.disabled]"
        @click="selectDate(item)"
      >
        <div :class="$style.left">
          <div :class="$style.box"></div>
          <div :class="$style.date">{{ item.date }}</div>
        </div>
        <div :class="$style.space">
          {{ item.space > 0 ? `${item.space} ${$prismic.asText(content.available_text)}` : $prismic.asText(content.full_text) }}
        </div>
      </div>
    </div>

    <!-- PEOPLE -->
    <div v-show="peopleOptions?.[0]" :class="$style.guests">
      <h1 v-if="type === 'formSpecialRetreat' && content?.amount_of_people?.[0]" :class="$style.title">
        {{ $prismic.asText(content.amount_of_people) }}
      </h1>

      <div
        v-for="(item, index) in peopleOptions"
        :key="index"
        :class="[$style.peopleOption, item.space < 1 && $style.disabled]"
      >
        <div :class="$style.left">
          <div :class="[$style.less, (getCount(item.type) < 1) && $style.disabled]" @click="lessGuests(item.type)">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 6 2"><path d="M6 1.5H0v-1h6v1Z"/></svg>
          </div>

          <span :class="$style.number">{{ getCount(item.type) }} {{ $prismic.asText(content.guests_text) }}</span>

          <div :class="[$style.more, (getCount(item.type) === item.space) && $style.disabled]" @click="moreGuests(item.type)">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 6 6"><path d="M3.5 3.5V6h-1V3.5H0v-1h2.5V0h1v2.5H6v1H3.5Z"/></svg>
          </div>

          <div :class="$style.title">{{ item.title }}</div>
        </div>
        <div :class="$style.space">
          {{ item.space > 0 ? `${item.space} ${$prismic.asText(content.available_text)}` : $prismic.asText(content.full_text) }}
        </div>
      </div>
    </div>

    <!-- CONTACT -->
    <div :class="$style.contact">
      <h1 v-if="content?.contact_title?.[0]" :class="[$style.title, $style.contactTitle]">
        {{ $prismic.asText(content.contact_title) }}
      </h1>

      <div :class="[$style.formRow, $style.two]">
        <Input :class="$style.input" :placeholder="content.first_name_text" v-model="formData.firstName" required />
        <Input :class="$style.input" :placeholder="content.last_name_text" v-model="formData.lastName" required />
      </div>

      <div :class="[$style.formRow, $style.two]">
        <div :class="$style.phoneContainer">
          <div :class="$style.countryCode">
            <label>{{ $prismic.asText(content.country_code_text) }}</label>
            <div :class="$style.flex">
              <span>{{ formData.countryCode }}</span>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 5"><path d="M7.354 1.404 6.657.707 4.05 3.314 1.443.707l-.696.697L4.05 4.707l3.304-3.303Z"/></svg>
            </div>

            <select v-model="formData.countryCode">
              <option v-for="c in countries" :key="c.value" :value="c.value">{{ c.label }}</option>
            </select>
          </div>

          <Input :class="$style.input" :placeholder="content.phone_text" v-model="formData.phone" type="tel" required />
        </div>
      </div>

      <CheckBox :class="$style.newsletter" :label="content.newsletter_text" v-model="formData.newsletter" />

      <PrimaryButton :class="$style.submit" :text="content.send_button_text" @click="submit" is-dark/>
    </div>
  </form>
</template>

<script setup>
import { reactive, watch, computed } from 'vue'
import countries from '/data/countries.json'

const props = defineProps({
  content: Object,
  items: Array,
  retreat: Object,
  type: String,
})

const formData = reactive({
  option: {},
  checkIn: '',
  checkOut: '',
  guests: '',
  sharedGuests: 0,
  privateGuests: 0,
  firstName: '',
  lastName: '',
  email: '',
  countryCode: '+0',
  countryISO: '',
  phone: '',
  newsletter: false,
})

watch(() => props.items, () => {
  formData.option = props.items?.[0] || {}
}, { immediate: true })

const specialDates = computed(() => {
  if (!props.retreat?.dates) return []
  return props.retreat.dates.map(date => ({
    date: $prismic.asText(date.date),
    space: date.space_available_shared + date.space_available_private,
    shared: date.space_available_shared,
    private: date.space_available_private,
  }))
})

watch(() => props.retreat, () => {
  if (specialDates.value[0]) selectDate(specialDates.value[0])
}, { immediate: true })

const peopleOptions = computed(() => {
  const d = specialDates.value.find(d => d.date === formData.date)
  if (!d) return []
  return [
    { title: $prismic.asText(props.content.shared_room_text), space: d.shared, type: 'shared' },
    { title: $prismic.asText(props.content.private_room_text), space: d.private, type: 'private' },
  ]
})

function selectDate(date) {
  if (!date || date.space < 1) return
  formData.date = date.date
  formData.sharedGuests = 0
  formData.privateGuests = 0
}

const getCount = type => type === 'shared' ? formData.sharedGuests : formData.privateGuests

function lessGuests(type) {
  const t = type === 'shared' ? 'sharedGuests' : 'privateGuests'
  if (formData[t] > 0) formData[t]--
}

function moreGuests(type) {
  const t = type === 'shared' ? 'sharedGuests' : 'privateGuests'
  formData[t]++
}

async function submit() {
  const country = countries.find(c => c.value === formData.countryCode)
  if (country) formData.countryISO = country.label.replace(/\s.*/, '')

  await $fetch('/api/booking', {
    method: 'POST',
    body: { ...formData, type: props.type },
  })
}

</script>
