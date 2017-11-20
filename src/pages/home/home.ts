import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Platform } from 'ionic-angular';

import { dummyData } from './dummyData';

declare const plugin: any;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  @ViewChild('map') mapElement: ElementRef;
  private map: any;

  constructor(public platform: Platform, public navCtrl: NavController) {

  }

  public ngAfterContentInit(): void {
    this.platform.ready().then(() => {
      this.map = plugin.google.maps.Map.getMap(this.mapElement.nativeElement, {
        controls: {
          compass: false,
          myLocationButton: true
        },
        gestures: {
          scroll: true,
          tilt: true,
          rotate: true,
          zoom: true
        },
        camera : {
          target: dummyData[0].position,
          zoom: 4
        },
        preferences: {
          zoom: {
            minZoom: 2,
            maxZoom: 18
          },
          building: false
        },
      });

      this.map.addEventListener(plugin.google.maps.event.MAP_READY, this.onMapReady.bind(this));
    });
  }

  private onMapReady() {
    this.plotMapMarkers();
  }

  private plotMapMarkers() {
    const markers = [];

    dummyData.map(place => {
      const lat = place.position.lat;
      const lng = place.position.lng;
      markers.push({
        position: {
          lat,
          lng
        },
        disableAutoPan: true, // This is onfortunately ignored when adding markers to the cluster :(
      });
    });

    this.map.clear();

    this.map.addMarkerCluster({
      boundsDraw: false,
      maxZoomLevel: 18,
      markers,
      icons: [
        {
          min: 2,
          url: 'assets/imgs/map-pin-zoom.png',
          anchor: { x: 24, y: 24 },
          label: {
            color: 'white',
            fontSize: 10,
            bold: true
          },
          size: {
            width: 64,
            height: 64
          }
        }
      ]
    }, (markerCluster) => {
      markerCluster.on(plugin.google.maps.event.MARKER_CLICK, this.onMarkerClick.bind(this));
    });
  }

  private onMarkerClick(params: any[]) {
    console.log('marker clicked');
    console.log(params); // This only returns the locaton object
  }

}
