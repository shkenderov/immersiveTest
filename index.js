import '@ar-js-org/ar.js';
import 'aframe-look-at-component';
import 'aframe-osm-3d';
import { GoogleProjection } from 'jsfreemaplib';


    setTimeout(function() { 
        document.querySelector('#startBtn').addEventListener('click', e=> {
    
                document.querySelector('a-scene').style.visibility="visible";
                document.querySelector('#menu').style.visibility="hidden";
            
        });
    },500);
    
    var ProgressFlag=0;
    
    AFRAME.registerComponent('scene', {
        resetVariables: function() {
            this.xrHitTestSource = null;
            this.viewerSpace = null;
            this.floorSpace = null;
            this.xrSession = null;
        },
    tick: function(){
        if(!this.el.sceneEl.is('ar-mode')) return;
        if(this.xrSession && this.el.sceneEl.frame && this.floorSpace && this.xrHitTestSource) {
            // Get the current frame
            const frame = this.el.sceneEl.frame;
            const hitTestResults = frame.getHitTestResults(this.xrHitTestSource);
             // If we have any...
            if(hitTestResults.length > 0) {
                // Get pose and position of the hit, as the first example
                const pose = hitTestResults[0].getPose(this.floorSpace);
                const position = {
                    x: pose.transform.position.x,
                    y: pose.transform.position.y,
                    z: pose.transform.position.z
                };
                // Set the reticle's position to the hit position
                // We use this in the "select" event handler, above
                this.el.setAttribute('position', position);
            }
        }
        const startBox = document.getElementById('box');
        console.log("PROGRESS: "+ProgressFlag);
            if(navigator.geolocation) {
                navigator.geolocation.getCurrentPosition (
                        gpspos=> {
                            if(ProgressFlag==0) {
                               

                                if(Math.abs( startBox.getAttribute('position').x-this.camera.getAttribute('position').x)+Math.abs( startBox.getAttribute('position').z-this.camera.getAttribute('position').z)<=5){
                                    console.log(startBox.getAttribute('position').x-this.camera.getAttribute('position').x);
                                    
                                    const box2= document.getElementById('box2');
                                    box2.setAttribute('material', {
                                        color: 'blue'
                                    });
                                    box2.setAttribute('geometry', {
                                        depth:"5",
                                        height:"5",
                                        width:"5"
                                    });
                                    const [e2,n2] = this.merc.project(gpspos.coords.longitude, gpspos.coords.latitude);
                                    box2.setAttribute('position', {
                                        x: e2+10,
                                        y: 0,
                                        z: -n2-10 // negate the northing!
                                    });
                                
                                       
                                ProgressFlag++;                           
                                }
                            }
                                 if(ProgressFlag==1){
                                    if(Math.abs( box2.getAttribute('position').x-this.camera.getAttribute('position').x)+Math.abs( box2.getAttribute('position').z-this.camera.getAttribute('position').z)<=5){
                                        
                                        const box3= document.getElementById('box3');
                                        box3.setAttribute('material', {
                                            color: 'green'
                                        });
                                        box3.setAttribute('geometry', {
                                            depth:"5",
                                            height:"5",
                                            width:"5"
                                        });
                                        const [e3,n3] = this.merc.project(gpspos.coords.longitude, gpspos.coords.latitude);
                                        box3.setAttribute('position', {
                                            x: e3+50,
                                            y: 0,
                                            z: -n3-50 // negate the northing!
                                        });
                                        ProgressFlag++;                           

                                }
     
                                }
                                if(ProgressFlag==2){
                                    if(Math.abs( box3.getAttribute('position').x-this.camera.getAttribute('position').x)+Math.abs( box3.getAttribute('position').z-this.camera.getAttribute('position').z)<=5){
                                    
                                        const box4= document.getElementById('box4');

                                        box4.setAttribute('geometry', {
                                            depth:"5",
                                            height:"5",
                                            width:"5"
                                        });
                                        const [e4,n4] = this.merc.project(gpspos.coords.longitude, gpspos.coords.latitude);
                                        box4.setAttribute('position', {
                                            x: e4+100,
                                            y: 0,
                                            z: -n4-100 // negate the northing!
                                        });
                                        this.pause();                        

                                }
                                }
                            
  
                               
                            //console.log(gpspos.coords.latitude);
                                //2ND CLUE TESTING 

                        },
            
                        err=> {
                            alert(`An error occurred: ${err.code}`);
                        }
            
                    );
            } else {
                alert("Sorry, geolocation not supported in this browser");
            }
       
    },
    init: function() {
        this.resetVariables();

        // when session ends set everything to null
        //this.el.sceneEl.renderer.xr.addEventListener('sessionend', this.resetVariables.bind(this));
        //this.xrSession = this.el.sceneEl.renderer.xr.getSession();
        navigator.xr.requestSession("immersive-vr")
        .then((xrSession) => {
          xrSession.addEventListener('end', onXRSessionEnded);
          // Do necessary session setup here.
          // Begin the session’s animation loop.
          xrSession.requestAnimationFrame(onXRAnimationFrame);
        }).catch(function(error) {
          // "immersive-vr" sessions are not supported
          console.warn("'immersive-vr' isn't supported, or an error occurred activating VR!");
        });
        this.xrSession.addEventListener('select', xrInputSourceEvent => {
            // Set 'pos' to the RETICLE position (this component is 
            // attached to the reticle so this.el will represent the
            // reticle). The reticle position is determined in tick(), 
            // below
            const pos = this.el.getAttribute('position');
        
            // Set dino to the RETICLE position
            document.getElementById('dino').setAttribute('position' , {
                x: pos.x,
                y: pos.y,
                z: pos.z
                });

        });
        const startBox = document.getElementById('box');

        this.merc = new GoogleProjection();
        this.camera = document.querySelector('a-camera');
       
        startBox.setAttribute('material', {
            color: 'magenta'
        });
        startBox.setAttribute('geometry', {
            depth:"5",
             height:"5",
              width:"5"
        });

       

        // Handle a GPS update ...
        window.addEventListener('gps-camera-update-position', e => {
            console.log(e);
            const [ee,n] = this.merc.project(e.detail.position.longitude, e.detail.position.latitude);
           


            // Set the camera's position to the current world position
            // [camera] selects the entity with a 'camera' component, i.e.
            // the camera entity
            document.querySelector('a-camera').setAttribute('position', {
                x: ee,
                y: 0,
                z: -n // negate the northing!
            });
            //console.log(  document.querySelector('a-camera').getAttribute('position'));

                //console.log(e.detail.position.longitude," ", e.detail.position.latitude);
            
                startBox.setAttribute("position", {
                    x: ee+10,
                    y: 0,
                    z: -n-5 // negate the northing!
                });

              
   
                //console.log( startBox.getAttribute('geometry'));

            // Set the 'lat' and 'lon' attributes of the 'terrarium-dem'
            // component to our current latitude and longitude. This will
            // trigger a chain reaction of downloading first the DEM data, and
            // then the OSM data
            /*console.log('Calling terrarium dem..');
            this.el.setAttribute('terrarium-dem', {
                lat: e.detail.position.latitude,
                lon: e.detail.position.longitude 
            })*/


            //console.log(Math.abs( startBox.getAttribute('position').x-this.camera.getAttribute('position').x));

        });

        // This event will fire when the elevation of our current location is available from the DEM.
        this.el.addEventListener('elevation-available', e => {
            console.log(`Got ele: ${e.detail.elevation}`);
            this.camera.object3D.position.y = e.detail.elevation + 1.6;
        });


        
        /*
        // This event will fire when the OSM data has been downloaded.
        this.el.addEventListener('osm-data-loaded', e => {
            // e.detail.pois contains GeoJSON data, as for last week.
            // Filter the result to select only peaks.
            e.detail.pois
                .filter ( poi => poi.properties.natural == 'peak')
                .forEach ( peak => {

                    // Create entities for the text and cone, and also a
                    // compound entity which will contain the text and cone.
                    // It is the compound entity which will be positioned in
                    // the world.
                    const textEntity = document.createElement('a-text');
                    const coneEntity = document.createElement('a-cone');
                    const compoundEntity = document.createElement('a-entity');
                    
                    // set the elevation of the entity. This will be contained
                    // within the GeoJSON geometry's 'coordinates' array, as the
                    // third member. Units are in metres.
                    // To do this set the y of the element's position to this
                    // value from the GeoJSON.

                    compoundEntity.setAttribute('position', {    
                        x: 0,
                        y: peak.geometry.coordinates[2],
                        z: 0
                    });

                    // set the lat and lon of the compound entity by setting
                    // its gps-projected-entity place component
                    compoundEntity.setAttribute('gps-projected-entity-place', {
                        latitude: peak.geometry.coordinates[1],
                        longitude: peak.geometry.coordinates[0]
                    });

                    // Set the properties of the cone
                    coneEntity.setAttribute('radius-bottom', 100);
                    coneEntity.setAttribute('height', 300);
                    coneEntity.setAttribute('material', {
                        color: 'magenta'
                    });
            
                    // Set the position of the cone relative to its parent
                    // (the compound entity)
                    coneEntity.setAttribute('position', {
                        x: 0,
                        y: 300,
                        z: 0
                    });
    
                    // Set the scale of the text
                    textEntity.setAttribute('scale',  {
                        x: 1000,
                        y: 1000,
                        z: 1000
                    });
                    // Make the text look-at the camera
                    textEntity.setAttribute('look-at', '[gps-projected-camera]');

    
                    // Horizontally centre-align the text so the centre of the
                    // text is placed at the parent entity's world position
                    textEntity.setAttribute('align', 'center');
                    textEntity.setAttribute('value', peak.properties.name || 'No name');

                    // Add the text and cone to the compound entity
                    compoundEntity.appendChild(textEntity);
                    compoundEntity.appendChild(coneEntity);
                    
                    // Add the compound entity to the scene
                    this.el.sceneEl.appendChild(compoundEntity);
            });
        });*/
    }
});
