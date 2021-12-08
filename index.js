import '@ar-js-org/ar.js';
import 'aframe-look-at-component';
import 'aframe-osm-3d';
import { GoogleProjection } from 'jsfreemaplib';
//MAP
const map = L.map ("map1");

const attrib="Map data copyright OpenStreetMap contributors, Open Database Licence";

L.tileLayer
        ("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
            { attribution: attrib } ).addTo(map);
            
map.setView([50.908,-1.4], 14);

//DATABASE INIT
let db;

const indexedDB = window.indexedDB;
let request = indexedDB.open("sessiondb", 1);

request.onsuccess = function(e) {
    console.log("Successfully opened the database!");
    db = e.target.result;
    query();
}
request.onerror = function(e) {
    // Imagine console.log() is a function which fills a div with content
    console.log("Error opening database: " + e.target.errorCode);
}

request.onupgradeneeded = e=> {
    const db = e.target.result; // IDBDatabase instance

    // If upgrading to version >=2, delete the old object store
    if(db.version >= 2) {
        db.deleteObjectStore('sessions');
    }

    const objectStore = db.createObjectStore("sessions", {
            keyPath:"username"
    });

    const sessions = [
        {
            username:"abv", lat1:'56.2', lon1:'40.5',lat2:'22.2', lon2:'25.5',lat3:'33.2', lon3:'35.5'
        }
    ];

    for(let i=0; i<sessions.length; i++) {
        objectStore.add(sessions[i]);
    };
};

function query(){
    //DATABASE QUERY
    const username = "abv";
    const transaction = db.transaction("sessions");
    const objectStore = transaction.objectStore('sessions');
    request = objectStore.get(username);
    request.onsuccess =  e => {
        if(e.target.result) {
            alert(e.target.result.username+" "+e.target.result.lat1+" "+e.target.result.lon1+" "+e.target.result.lat2+" "+e.target.result.lon2+" "+e.target.result.lat3+" "+e.target.result.lon3);

        } else {
            displayMessage('No results!');
        } 
    };

    request.onerror = e => {
        displayMessage(`ERROR ${e.target.errorCode}`);
    };
}
    setTimeout(function() { 
        document.querySelector('#startBtn').addEventListener('click', e=> {
    
                document.querySelector('a-scene').style.visibility="visible";
                document.querySelector('#menu').style.visibility="hidden";
                const username=document.getElementById("name").ariaValueMax;
                const transaction = db.transaction=db.transaction("")
            
        });
    },500);
    
    var ProgressFlag=0;
    
    AFRAME.registerComponent('scene', {
      
    tick: function(){
        /*const navBox=document.getElementById('navbox');
        navbox.setAttribute('position', {
            x: this.camera.getAttribute('position').x,
            y: 3,
            z: this.camera.getAttribute('position').z-5 // negate the northing!
        });*/
        const startBox = document.getElementById('box');
        console.log("PROGRESS: "+ProgressFlag);
            if(navigator.geolocation) {
                
                navigator.geolocation.getCurrentPosition (
                    
                        gpspos=> {
                            const [e2,n2] = this.merc.project(gpspos.coords.longitude, gpspos.coords.latitude);

                            if(ProgressFlag==0) {
                               

                                if(Math.abs( startBox.getAttribute('position').x-this.camera.getAttribute('position').x)+Math.abs( startBox.getAttribute('position').z-this.camera.getAttribute('position').z)<=7){
                                    console.log(startBox.getAttribute('position').x-this.camera.getAttribute('position').x);
                                    
                                    const box2= document.getElementById('box2');
                                    const text1= document.getElementById('text1');
                                    box2.setAttribute('material', {
                                        color: 'blue'
                                    });
                                    box2.setAttribute('geometry', {
                                        depth:"5",
                                        height:"10",
                                        width:"7"
                                    });
                                    box2.setAttribute('position', {
                                        x: e2+10,
                                        y: 0,
                                        z: -n2-10 // negate the northing!
                                    });
                                    text1.setAttribute('position', {
                                        x: e2+10,
                                        y: 0,
                                        z: -n2-10// negate the northing!
                                    });
                                ProgressFlag++;                           
                                }
                            }
                                 if(ProgressFlag==1){
                                    if(Math.abs( box2.getAttribute('position').x-this.camera.getAttribute('position').x)+Math.abs( box2.getAttribute('position').z-this.camera.getAttribute('position').z)<=7){
                                        
                                        const box3= document.getElementById('box3');
                                        box3.setAttribute('material', {
                                            color: 'green'
                                        });
                                        box3.setAttribute('geometry', {
                                            depth:"5",
                                            height:"5",
                                            width:"5"
                                        });
                                        box3.setAttribute('position', {
                                            x: e2+50,
                                            y: 0,
                                            z: -n2-50 // negate the northing!
                                        });
                                        ProgressFlag++;                           

                                }
     
                                }
                                if(ProgressFlag==2){
                                    if(Math.abs( box3.getAttribute('position').x-this.camera.getAttribute('position').x)+Math.abs( box3.getAttribute('position').z-this.camera.getAttribute('position').z)<=7){
                                    
                                        const box4= document.getElementById('box4');

                                        box4.setAttribute('geometry', {
                                            depth:"5",
                                            height:"5",
                                            width:"5"
                                        });
                                        box4.setAttribute('position', {
                                            x: e2+100,
                                            y: 0,
                                            z: -n2-100 // negate the northing!
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
