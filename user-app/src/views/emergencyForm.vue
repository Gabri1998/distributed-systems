<template>
  <div>
    <div class="explannation">
      <br />
      <h4>Please answer the following questionnaire.</h4>
      <h6>We require you to answer all of the questions</h6>
      <br />
    </div>
    <div class="wrapper inner">
      <div v-for="(question, index) in multipleChoiceQuestions" :key="index" class="mb-4">
        <h5>{{ question.text }}</h5>
        <b-form-group v-if="question.type === 'multipleChoice'">
          <b-form-radio-group
            v-model="question.answer"
            :options="question.choices"
          ></b-form-radio-group>
        </b-form-group>
      </div>

      <div v-for="(question, index) in yesNoQuestions" :key="index" class="mb-4">
        <h5>{{ question.text }}</h5>
        <b-form-group v-if="question.type === 'yesNo'">
          <b-form-radio-group
            v-model="question.answer"
            :options="yesNoOptions"
          ></b-form-radio-group>
        </b-form-group>
      </div>

      <b-alert variant="danger" :show="showAlert" @dismiss="showAlert = false">
        Please answer all questions before submitting the survey.
      </b-alert>
      <div class="my-3"></div>
      <b-button @click="submitSurvey" variant="primary">Submit</b-button>
      <div class="my-3"></div>
      <router-link :to="{ path: '/emergency-results' }">
        <b-button @click="checkResult" variant="primary" :disabled="!surveySubmitted"
          >Check Result</b-button
        >
      </router-link>
    </div>
  </div>
</template>

<script>
import { postScore } from '../apis/emergencyBooking'
export default {
  data() {
    return {
      showAlert: false,
      surveySubmitted: false,
      multipleChoiceQuestions: [
        {
          text: '1. When did you last visit a dentist',
          type: 'multipleChoice',
          choices: [
            '6 months or less',
            'More than 6 months, but not more than 1 year ago',
            'More than 1 year, but not more than 3 years ago',
            'More than 3 years, but not more than 5 years ago',
            'More than 5 years ago'
          ],
          answer: null
        },
        {
          text: '2. Why did you visit the dentist?',
          type: 'multipleChoice',
          choices: [
            'Personally visited for check-up, examination, or cleaning',
            'Was called by the dentist for check-up, examination, or cleaning',
            'The previous treatment had a problem',
            'Something was wrong, bothering or hurting',
            'Went for a treatment of a condition that the dentist discovered at earlier checkup or examination'
          ],
          answer: null
        },
        {
          text: '3. How often did you have aching in mouth?',
          type: 'multipleChoice',
          choices: ['Never', 'Hardly Ever', 'Occassionally', 'Fairly Often', 'Very Often'],
          answer: null
        },
        {
          text: '4. How often did you have difficulty in your job due to oral problem?',
          type: 'multipleChoice',
          choices: ['Never', 'Hardly Ever', 'Occassionally', 'Fairly Often', 'Very Often'],
          answer: null
        },
        {
          text: '5. How would you rate the health of your teeth and gums?',
          type: 'multipleChoice',
          choices: ['Excellent', 'Good', 'Fair', 'Bad', 'Extremely Bad'],
          answer: null
        }
      ],
      yesNoQuestions: [
        {
          text: '6. Have you ever needed to visit a dentist but could not during the last 12 months?',
          type: 'yesNo',
          answer: null
        },
        {
          text: '7. Did the dentist explain about the benefit of giving up cigarettes?',
          type: 'yesNo',
          answer: null
        },
        {
          text: '8. Did the dentist explain about the benefits of checking blood sugar?',
          type: 'yesNo',
          answer: null
        },
        {
          text: '9. Do you think you might have a gum disease?',
          type: 'yesNo',
          answer: null
        },
        {
          text: '10. Have you experienced teeth becoming loose without an injury?',
          type: 'yesNo',
          answer: null
        }
      ],
      yesNoOptions: [
        { text: 'Yes', value: true },
        { text: 'No', value: false }
      ]
    }
  },
  methods: {
    mapOptionToValue(question, option) {
      if (question.type === 'yesNo') {
        return option ? 1 : 2
      }
      if (question.choices && question.choices.length > 0) {
        const index = question.choices.findIndex((choice) => choice === option)
        return index !== -1 ? index + 1 : null
      }
      return null
    },
    async submitSurvey() {
      /* Real survey data but not used for now.
      const surveyData = {
        multipleChoiceQuestions: this.multipleChoiceQuestions.map((question, index) => ({
          questionNumber: index + 1,
          chosenOption: this.mapOptionToValue(question, question.answer)
        })),
        yesNoQuestions: this.yesNoQuestions.map((question, index) => ({
          questionNumber: index + 1 + this.multipleChoiceQuestions.length,
          chosenOption: this.mapOptionToValue(question, question.answer)
        }))
      }
      **/

      // Data below is the calculation method for the emergency score.
      // Instead of our server doing the calculation, the client's computer does the math. (GDPR issue)

      const importanceValues = {
        1: 22,
        2: 15,
        3: 6,
        4: 6,
        5: 22,
        6: 15,
        7: 2,
        8: 6,
        9: 6,
        10: 6
      }

      const multipleWeights = {
        choice1: 0.0,
        choice2: 0.1,
        choice3: 0.2,
        choice4: 0.3,
        choice5: 0.4
      }

      const yesNoWeights = {
        choice1: 1.0,
        choice2: 0.0
      }

      const multipleScore = this.multipleChoiceQuestions.reduce((sum, question) => {
        const chosenOption = this.mapOptionToValue(question, question.answer)
        const importance = importanceValues[question.text.charAt(0)]
        const weight = chosenOption !== null ? multipleWeights[`choice${chosenOption}`] : 0

        return sum + importance * weight
      }, 0)

      const yesNoScore = this.yesNoQuestions.reduce((sum, question) => {
        const chosenOption = this.mapOptionToValue(question, question.answer)

        const questionNumber = parseInt(question.text.match(/\d+/)[0])
        const importance = importanceValues[questionNumber]
        const weight = chosenOption !== null ? yesNoWeights[`choice${chosenOption}`] : 0

        return sum + importance * weight
      }, 0)
      const calculatedScore = Number((multipleScore + yesNoScore).toFixed(2))

      console.log(calculatedScore)

      try {
        const data = await postScore(calculatedScore)
        console.log('Submission successful')
      } catch (err) {
        this.err = 'An error occurred during postScore'
        console.error(err)
      } finally {
        this.surveySubmitted = true
      }
    }
  }
}
</script>
