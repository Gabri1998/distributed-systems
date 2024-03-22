<template>
  <div id="gmap-container">
    <GMapMap
      ref="map"
      class="GMapMap"
      :center="center"
      :zoom="12"
      map-type-id="terrain"
      :options="mapOptions"
    >
      <!-- Use v-for to loop through markers and create GMapMarker components -->
      <GMapMarker
        v-for="marker in markers"
        :key="marker.id"
        :ref="marker.id"
        :position="marker.position"
        :clickable="true"
        :draggable="true"
        @click="onMarkerClicked(marker)"
        @mouseover="onMarkerMouseOver(marker)"
        @mouseout="onMarkerMouseOut"
      />
      <GMapInfoWindow
        :opened="isInfoWindowVisible"
        :position="infoWindowPosition"
        :options="infoWindowOptions"
        ref="infoWindow"
      >
        <!-- Your InfoWindow content goes here -->
        <div>
          <h3>{{ infoWindowTitle }}</h3>
          <p>
            Click to visit clinic page and dentists schedule.
            <!--Click <router-link :to="infoWindowLink"> here</router-link> for the schedule.-->
            {{ infoWindowContent }}
          </p>
        </div>
      </GMapInfoWindow>
    </GMapMap>
  </div>
</template>

<script>
export default {
  props: {
    markers: Array,
    center: Object,
    mapOptions: Object
  },
  data() {
    return {
      isInfoWindowVisible: false,
      infoWindowPosition: {},
      infoWindowOptions: {
        pixelOffset: {
          width: 0,
          height: -38
        },
        maxWidth: 320,
        maxHeight: 320
      },
      infoWindowTitle: '',
      infoWindowContent: '',
      infoWindowLink: '',
      hoveredMarker: null
    }
  },
  methods: {
    async onMarkerClicked(marker) {
      await this.$store.dispatch('selectClinic', marker)
      await this.$store.dispatch('fetchClinicDentists')
      this.$refs.map.panTo(marker.position)
      this.$router.push({ path: '/clinic' })
    },
    onMarkerMouseOver(marker) {
      this.hoveredMarker = marker
      this.showInfoWindow(marker)
    },
    onMarkerMouseOut() {
      this.hoveredMarker = null
      this.hideInfoWindow()
    },
    showInfoWindow(marker) {
      this.infoWindowPosition = marker.position
      this.infoWindowTitle = `${marker.clinicName}`
      this.isInfoWindowVisible = true
    },
    hideInfoWindow() {
      // Close the InfoWindow
      this.isInfoWindowVisible = false
    }
  }
}
</script>

<style scoped>
#gmap-container {
  width: 100%;
  height: 70vh;
}

.GMapMap {
  width: 100%;
  height: 100%;
}

@media (min-width: 768px) {
  .responsive-container {
    height: 100%;
  }
}
</style>
