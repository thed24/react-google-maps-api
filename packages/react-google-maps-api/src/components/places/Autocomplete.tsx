import { Children, createRef, PureComponent, type ReactChild, type RefObject } from 'react'

import { unregisterEvents, applyUpdatersToPropsAndRegisterEvents } from '../../utils/helper'

import MapContext from '../../map-context'

import invariant from 'invariant'

const eventMap = {
  onPlaceChanged: 'place_changed',
}

const updaterMap = {
  bounds(
    instance: google.maps.places.Autocomplete,
    bounds: google.maps.LatLngBounds | google.maps.LatLngBoundsLiteral
  ): void {
    instance.setBounds(bounds)
  },
  restrictions(
    instance: google.maps.places.Autocomplete,
    restrictions: google.maps.places.ComponentRestrictions
  ): void {
    instance.setComponentRestrictions(restrictions)
  },
  fields(instance: google.maps.places.Autocomplete, fields: string[]): void {
    instance.setFields(fields)
  },
  options(
    instance: google.maps.places.Autocomplete,
    options: google.maps.places.AutocompleteOptions
  ): void {
    instance.setOptions(options)
  },
  types(instance: google.maps.places.Autocomplete, types: string[]): void {
    instance.setTypes(types)
  },
}

interface AutocompleteState {
  autocomplete: google.maps.places.Autocomplete | null
}

export interface AutocompleteProps {
  // required
  children: ReactChild
  /** The area in which to search for places. */
  bounds?: google.maps.LatLngBounds | google.maps.LatLngBoundsLiteral | undefined
  /** The component restrictions. Component restrictions are used to restrict predictions to only those within the parent component. For example, the country. */
  restrictions?: google.maps.places.ComponentRestrictions | undefined
  /** Fields to be included for the Place in the details response when the details are successfully retrieved. For a list of fields see PlaceResult. Nested fields can be specified with dot-paths (for example, "geometry.location"). */
  fields?: string[] | undefined
  options?: google.maps.places.AutocompleteOptions | undefined
  /** The types of predictions to be returned. For a list of supported types, see the developer's guide. If nothing is specified, all types are returned. In general only a single type is allowed. The exception is that you can safely mix the 'geocode' and 'establishment' types, but note that this will have the same effect as specifying no types. */
  types?: string[] | undefined
  /** This event is fired when a PlaceResult is made available for a Place the user has selected. If the user enters the name of a Place that was not suggested by the control and presses the Enter key, or if a Place Details request fails, the PlaceResult contains the user input in the name property, with no other properties defined. */
  onPlaceChanged?: (() => void) | undefined
  /** This callback is called when the autocomplete instance has loaded. It is called with the autocomplete instance. */
  onLoad?: ((autocomplete: google.maps.places.Autocomplete) => void) | undefined
  /** This callback is called when the component unmounts. It is called with the autocomplete instance. */
  onUnmount?: ((autocomplete: google.maps.places.Autocomplete) => void) | undefined
  className?: string | undefined
}

export class Autocomplete extends PureComponent<AutocompleteProps, AutocompleteState> {
  static contextType = MapContext

  registeredEvents: google.maps.MapsEventListener[] = []
  containerElement: RefObject<HTMLDivElement> = createRef()

  state: AutocompleteState = {
    autocomplete: null,
  }

  setAutocompleteCallback = (): void => {
    if (this.state.autocomplete !== null && this.props.onLoad) {
      this.props.onLoad(this.state.autocomplete)
    }
  }

  componentDidMount(): void {
    invariant(
      !!google.maps.places,
      'You need to provide libraries={["places"]} prop to <LoadScript /> component %s',
      google.maps.places
    )

    // TODO: why current could be equal null?
    // @ts-ignore
    const input = this.containerElement.current.querySelector('input')

    if (input) {
      const autocomplete = new google.maps.places.Autocomplete(input, this.props.options)

      this.registeredEvents = applyUpdatersToPropsAndRegisterEvents({
        updaterMap,
        eventMap,
        prevProps: {},
        nextProps: this.props,
        instance: autocomplete,
      })

      this.setState(function setAutocomplete() {
        return {
          autocomplete,
        }
      }, this.setAutocompleteCallback)
    }
  }

  componentDidUpdate(prevProps: AutocompleteProps): void {
    unregisterEvents(this.registeredEvents)

    this.registeredEvents = applyUpdatersToPropsAndRegisterEvents({
      updaterMap,
      eventMap,
      prevProps,
      nextProps: this.props,
      instance: this.state.autocomplete,
    })
  }

  componentWillUnmount(): void {
    if (this.state.autocomplete !== null) {
      unregisterEvents(this.registeredEvents)
    }
  }

  render(): JSX.Element {
    return <div ref={this.containerElement} className={this.props.className || ''}>{Children.only(this.props.children)}</div>
  }
}

export default Autocomplete
