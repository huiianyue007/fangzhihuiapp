<template>
  <gmap-map :center="center" :options = 'mapOption' @idle = 'idle' ref = 'map' @drag="drag"></gmap-map>
</template>
<script>
  import MarkerClusterer from 'marker-clusterer-plus'
  export default {
    data () {
      return {
        markerClustererStyles: {
          width: 50,
          height: 50,
          url: 'linshiimg/Summary_red.png',
          textColor: '#fff'
        },
        markerObjList: [],
        markerStyle: {
          icon: 'linshiimg/marker.png',
          activeIcon: 'linshiimg/marker_active.png',
          color: '#fff',
          activeColor: '#333'
        },
        markerClusterer: null
      }
    },
    computed: {
    },
    watch: {
      markers () {
        this.markerObjList = []
        if (this.markerClusterer) {
          this.markerClusterer.clearMarkers()
        }
        this.init()
      }
    },
    mounted () {
      let self = this
      this.$refs.map.$mapCreated.then(function () {
        self.init()
      })
    },
    methods: {
      add (makers) {
        if (!this.markerClusterer) {
          this.init()
        }
        const makersList = []
        if (this.markerClusterer) {
          for (let i in makers) {
            let item = makers[i]
            let marker = this.createMaker(item)
            this.markerObjList.push(marker)
            makersList.push(marker)
          }
          this.markerClusterer.addMarkers(makersList)
        }
      },
      createMaker (item) {
        let self = this
        let marker = new google.maps.Marker({
          position: {
            lat: item.lat,
            lng: item.lng
          },
          label: {
            color: '#fff',
            fontSize: '10px',
            text: item.price
          },
          icon: this.markerStyle.icon,
          color: this.markerStyle.color,
          data: item
        })
        marker.addListener('click', function () {
          self.markerObjList.forEach(item => {
            if (item.icon === self.markerStyle.activeIcon) {
              item.setIcon(self.markerStyle.icon)
            }
          })
          this.setIcon(self.markerStyle.activeIcon)
          self.$emit('select', this.data)
        })
        return marker
      },
      clean () {
        if (this.markerClusterer) {
          this.markerClusterer.clearMarkers()
        }
      },
      init () {
        if (!window.google) return false
        let self = this
        this.markerObjList = []
        for (let i in this.markers) {
          let item = this.markers[i]
          let marker = this.createMaker(item)
          this.markerObjList.push(marker)
        }
        const map = this.$refs.map.$mapObject
        this.markerClusterer = new MarkerClusterer(this.$refs.map.$mapObject, this.markerObjList, {
          zoomOnClick: false,
          gridSize: 80,
          styles: [this.markerClustererStyles]
        })
        if (map) {
          map.addListener('zoom_changed', () => {
            this.$emit('zoomChanged', map.getZoom())
          })
        }
        google.maps.event.addListener(this.markerClusterer, 'clusterclick', function (cluster) {
          let markers = cluster.getMarkers()
          let length = markers.length
          let isSame = true
          let datas = markers.map(({data}) => data)
          if (map.getZoom() === self.mapOption.maxZoom) {
            self.$emit('select', datas)
            return
          }
            /* start 匹配坐标与缩放比例*/
          for (let i = 1; i < length; i++) {
            if (markers[i].getPosition().lat() !== markers[i - 1].getPosition().lat() || markers[i].getPosition().lng() !== markers[i - 1].getPosition().lng()) {
              isSame = false
              break
            }
          }
          /* end 匹配坐标与缩放比例*/
          if (isSame) {
            self.$emit('select', datas)
          } else {
            map.setCenter(cluster.getCenter())
            map.setZoom(map.getZoom() + 1)
          }
        })
      },
      drag () {
        this.$emit('drag')
      },
      idle () {
        let ne = this.$refs.map.$mapObject.getBounds().getNorthEast()
        let sw = this.$refs.map.$mapObject.getBounds().getSouthWest()
        let bounds = {
          lat1: ne.lat(),
          lon1: ne.lng(),
          lat2: sw.lat(),
          lon2: sw.lng()
        }
        this.$emit('idle', bounds)
      }
    },
    props: ['center', 'markers', 'mapOption', 'label', 'infoWindow', 'scale', 'labelOrigin', 'width', 'height', 'unit', 'infoOption', 'anchorOrigin']
  }
</script>