import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms'
import {AuthService} from '../auth.service'
import {GeoLocation, UserGeoLocations, UserProfileService} from '../user-profile.service'


function parseGeoString(geoString: string): GeoLocation {
  if ( geoString && geoString.trim().length > 0 ) {
    const split = geoString.split(',')

    const lat = parseFloat(split[0].trim())
    const lng = parseFloat(split[1].trim())
    return new GeoLocation(lat, lng)
  } else {
    return null
  }
}


function transformIntoLocationDictionaries(values: any) {
  let returnVal = {}

  for (let keyName of Object.keys(values)) {
    const geoString = values[keyName]

    const parsedGeoLocation: GeoLocation = parseGeoString(geoString)
    returnVal[keyName] = [ parsedGeoLocation ]
    // later we might have more geoLocations of a given type (e.g. study/work in multiple places)
  }
  return returnVal
}

function geoLocationToString(g: GeoLocation) {
  if ( ! g ) {
    return ''
  }
  return g.latitude + ', ' + g.longitude
}

@Component({
  selector: 'app-user-geo-locations',
  templateUrl: './user-geo-locations.component.html',
  styleUrls: ['./user-geo-locations.component.scss'],
})
export class UserGeoLocationsComponent implements OnInit {


  public formGroup: FormGroup;

  private formDefinition = {
    whereILive: '',
    whereIWork: '',
    whereIStudy: '',
  }

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private userProfileService: UserProfileService,
  ) {
    this.formGroup = this.formBuilder.group(this.formDefinition)
  }

  ngOnInit() {
    this.authService.user.subscribe(user => {
      console.log('UserGeoLocationsComponent: authService.user.subscribe user', user);
      this.userProfileService.getUserGeoLocations().subscribe(
          (geoLocationsFromDb: UserGeoLocations) => {
        this.applyFromDb(geoLocationsFromDb)
      })
    })
  }

  applyFromDb(geoLocationsFromDb: UserGeoLocations) {
    if (geoLocationsFromDb && geoLocationsFromDb.geoLocations) {
      const geoSubKeys = geoLocationsFromDb.geoLocations
      console.log('geoSubKeys', geoSubKeys)
      let geoLocationsTransformed = {}
      for (const keyName of Object.keys(this.formDefinition)) {
        const subKey = geoSubKeys[keyName]
        if ( subKey ) {
          geoLocationsTransformed[keyName] = geoLocationToString(subKey[0])
        } else {
          geoLocationsTransformed[keyName] = ''
        }
      }
      console.log('this.formGroup', this.formGroup)
      this.formGroup.setValue(geoLocationsTransformed)
      // this.formGroup.patchValue(geoLocationsTransformed)
    }
  }


  public getValue(): UserGeoLocations {
    return {
      geoLocations: transformIntoLocationDictionaries(this.formGroup.value),
    }
  }

}
