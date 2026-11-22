// Explicit display messages. Keep keys stable when editing wording.
const messages = {
  "ui.satellites": {
    nb: "Satellitter",
    en: "Satellites",
  },
  "ui.ground_stations": {
    nb: "Bakkestasjoner",
    en: "Ground stations",
  },
  "ui.norway_in_orbit": {
    nb: "Norge i bane",
    en: "Norway in orbit",
  },
  "ui.follow_norwegian_satellites_around_the_earth": {
    nb: "Følg norske satellitter rundt jorda.",
    en: "Follow Norwegian satellites around the Earth.",
  },
  "ui.all": {
    nb: "Alle",
    en: "All",
  },
  "ui.show_all": {
    nb: "Vis alle",
    en: "Show all",
  },
  "ui.show_none": {
    nb: "Vis ingen",
    en: "Show none",
  },
  "ui.altitude": {
    nb: "Høyde",
    en: "Altitude",
  },
  "ui.speed": {
    nb: "Fart",
    en: "Speed",
  },
  "ui.inclination": {
    nb: "Inklinasjon",
    en: "Inclination",
  },
  "ui.orbital_period": {
    nb: "Omløpstid",
    en: "Orbital period",
  },
  "ui.owner": {
    nb: "Eier",
    en: "Owner",
  },
  "ui.operator": {
    nb: "Operatør",
    en: "Operator",
  },
  "ui.coordinates": {
    nb: "Koordinater",
    en: "Coordinates",
  },
  "ui.more_information": {
    nb: "Mer informasjon",
    en: "More information",
  },
  "ui.launch_pads": {
    nb: "Oppskytingsramper",
    en: "Launch pads",
  },
  "ui.next_pass": {
    nb: "Neste passering",
    en: "Next pass",
  },
  "ui.follow_satellite": {
    nb: "Følg satellitten",
    en: "Follow satellite",
  },
  "ui.what_does_the_satellite_see": {
    nb: "Hva ser satellitten?",
    en: "What does the satellite see?",
  },
  "ui.return_to_globe": {
    nb: "Tilbake til hele jorda",
    en: "Return to globe",
  },
  "ui.show_globe": {
    nb: "Vis hele jorda",
    en: "Show globe",
  },
  "ui.place_names": {
    nb: "Stedsnavn",
    en: "Place names",
  },
  "ui.show_all_orbits": {
    nb: "Vis alle baner",
    en: "Show all orbits",
  },
  "ui.view": {
    nb: "Utsnitt",
    en: "View",
  },
  "ui.display": {
    nb: "Visning",
    en: "Display",
  },
  "ui.time": {
    nb: "Tid",
    en: "Time",
  },
  "ui.zoom": {
    nb: "Zoom",
    en: "Zoom",
  },
  "ui.language": {
    nb: "Språk",
    en: "Language",
  },
  "ui.real_time": {
    nb: "Sanntid",
    en: "Real time",
  },
  "ui.simulation": {
    nb: "Simulering",
    en: "Simulation",
  },
  "ui.paused": {
    nb: "Pauset",
    en: "Paused",
  },
  "ui.pause": {
    nb: "Pause",
    en: "Pause",
  },
  "ui.play": {
    nb: "Spill av",
    en: "Play",
  },
  "ui.now": {
    nb: "Nå",
    en: "Now",
  },
  "ui.location": {
    nb: "Sted",
    en: "Location",
  },
  "ui.show_pass": {
    nb: "Vis passeringen",
    en: "Show pass",
  },
  "ui.calculated_position": {
    nb: "Beregnet posisjon",
    en: "Calculated position",
  },
  "ui.source": {
    nb: "Kilde",
    en: "Source",
  },
  "ui.image": {
    nb: "Bilde",
    en: "Image",
  },
  "ui.illustration": {
    nb: "Illustrasjon",
    en: "Illustration",
  },
  "ui.orbital_data": {
    nb: "Banedata",
    en: "Orbital data",
  },
  "ui.earth_imagery": {
    nb: "Jordbilder",
    en: "Earth imagery",
  },
  "ui.launched_utc": {
    nb: "Skutt opp (UTC)",
    en: "Launched (UTC)",
  },
  "ui.launch_vehicle": {
    nb: "Bærerakett",
    en: "Launch vehicle",
  },
  "ui.launch_site": {
    nb: "Oppskytingssted",
    en: "Launch site",
  },
  "ui.design_lifetime": {
    nb: "Planlagt levetid",
    en: "Design lifetime",
  },
  "ui.not_specified": {
    nb: "Ikke oppgitt",
    en: "Not specified",
  },
  "ui.norwegian_satellites_launched_here": {
    nb: "Norske satellitter skutt opp her",
    en: "Norwegian satellites launched here",
  },
  "ui.approximate_map_location": {
    nb: "Omtrentlig kartplassering",
    en: "Approximate map location",
  },
  "ui.approximate_centre_point": {
    nb: "Omtrentlig senterpunkt",
    en: "Approximate centre point",
  },
  "ui.spaceport_website": {
    nb: "Romhavnens nettside",
    en: "Spaceport website",
  },
  "ui.official_launch_information": {
    nb: "Offisiell oppskytingsinformasjon",
    en: "Official launch information",
  },
  "ui.show_ais_coverage": {
    nb: "Vis AIS-dekning",
    en: "Show AIS coverage",
  },
  "ui.show_radar_detection": {
    nb: "Vis radardeteksjon",
    en: "Show radar detection",
  },
  "ui.show_camera_field_of_view": {
    nb: "Vis kameraets synsfelt",
    en: "Show camera field of view",
  },
  "ui.show_communications_coverage": {
    nb: "Vis kommunikasjonsdekning",
    en: "Show communications coverage",
  },
  "ui.show_sun_sensor": {
    nb: "Vis solsensoren",
    en: "Show sun sensor",
  },
  "ui.show_radio_link": {
    nb: "Vis radioforbindelsen",
    en: "Show radio link",
  },
  "ui.show_satellite_function": {
    nb: "Vis satellittens funksjon",
    en: "Show satellite function",
  },
  "ui.low_earth_orbit_leo": {
    nb: "Lav jordbane · LEO",
    en: "Low Earth orbit · LEO",
  },
  "ui.geostationary_orbit_geo": {
    nb: "Geostasjonær bane · GEO",
    en: "Geostationary orbit · GEO",
  },
  "ui.highly_elliptical_orbit_heo": {
    nb: "Høyelliptisk bane · HEO",
    en: "Highly elliptical orbit · HEO",
  },
  "ui.low_earth_orbit": {
    nb: "Lav jordbane",
    en: "Low Earth orbit",
  },
  "ui.geostationary_orbit": {
    nb: "Geostasjonær bane",
    en: "Geostationary orbit",
  },
  "ui.highly_elliptical_orbit": {
    nb: "Høyelliptisk bane",
    en: "Highly elliptical orbit",
  },
  "ui.schematic_not_to_scale": {
    nb: "Prinsippskisse · ikke i målestokk",
    en: "Schematic · not to scale",
  },
  "ui.ship_monitoring_and_technology_demonstration": {
    nb: "Skipsovervåking og teknologiutprøving",
    en: "Ship monitoring and technology demonstration",
  },
  "ui.ship_monitoring_and_space_research": {
    nb: "Skipsovervåking og romforskning",
    en: "Ship monitoring and space research",
  },
  "ui.ship_monitoring_and_maritime_communications": {
    nb: "Skipsovervåking og maritim kommunikasjon",
    en: "Ship monitoring and maritime communications",
  },
  "ui.ship_monitoring_and_radar_detection": {
    nb: "Skipsovervåking og radardeteksjon",
    en: "Ship monitoring and radar detection",
  },
  "ui.ship_monitoring_for_the_norwegian_coastal_administration": {
    nb: "Skipsovervåking for Kystverket",
    en: "Ship monitoring for the Norwegian Coastal Administration",
  },
  "ui.technology_demonstration_for_space_norway": {
    nb: "Teknologiutprøving for Space Norway",
    en: "Technology demonstration for Space Norway",
  },
  "ui.student_satellite_testing_a_sun_sensor": {
    nb: "Studentsatellitt · tester solsensor",
    en: "Student satellite · testing a sun sensor",
  },
  "ui.ocean_observation_orbital_data_unavailable": {
    nb: "Havobservasjon · banedata utilgjengelige",
    en: "Ocean observation · orbital data unavailable",
  },
  "ui.student_satellite_re_entered_in_2024": {
    nb: "Studentsatellitt · brant opp i 2024",
    en: "Student satellite · re-entered in 2024",
  },
  "ui.ocean_observation_for_ntnu": {
    nb: "Havobservasjon for NTNU",
    en: "Ocean observation for NTNU",
  },
  "ui.norwegiandutch_radar_detection": {
    nb: "Norsk-nederlandsk radardeteksjon",
    en: "Norwegian–Dutch radar detection",
  },
  "ui.arctic_broadband": {
    nb: "Bredbånd i Arktis",
    en: "Arctic broadband",
  },
  "ui.tv_and_data_communications": {
    nb: "TV og datakommunikasjon",
    en: "TV and data communications",
  },
  "ui.tv_and_broadband": {
    nb: "TV og bredbånd",
    en: "TV and broadband",
  },
  "ui.drag_to_rotate_scroll_to_zoom": {
    nb: "Dra for å rotere · Rull for å zoome",
    en: "Drag to rotate · Scroll to zoom",
  },
  "ui.drag_to_rotate_pinch_to_zoom": {
    nb: "Dra for å rotere · Knip for å zoome",
    en: "Drag to rotate · Pinch to zoom",
  },
  "ui.filter_by_orbit_type": {
    nb: "Filtrer etter banetype",
    en: "Filter by orbit type",
  },
  "ui.interactive_globe": {
    nb: "Interaktiv jordklode",
    en: "Interactive globe",
  },
  "ui.places_on_the_globe": {
    nb: "Steder på kloden",
    en: "Places on the globe",
  },
  "ui.close_and_stop_tracking": {
    nb: "Lukk og avslutt sporing",
    en: "Close and stop tracking",
  },
  "ui.open_or_close_menu": {
    nb: "Åpne eller lukk meny",
    en: "Open or close menu",
  },
  "ui.minimise_information_card": {
    nb: "Minimer infokort",
    en: "Minimise information card",
  },
  "ui.close_object_menu": {
    nb: "Lukk objektmeny",
    en: "Close object menu",
  },
  "ui.objects_on_the_globe": {
    nb: "Objekter på kloden",
    en: "Objects on the globe",
  },
  "ui.playback_speed": {
    nb: "Avspillingshastighet",
    en: "Playback speed",
  },
  "ui.zoom_in": {
    nb: "Zoom inn",
    en: "Zoom in",
  },
  "ui.zoom_out": {
    nb: "Zoom ut",
    en: "Zoom out",
  },
  "ui.end_tracking_and_show_globe": {
    nb: "Avslutt fokus og vis hele jorda",
    en: "End tracking and show globe",
  },
  "ui.instrument": {
    nb: "Instrument",
    en: "Instrument",
  },
  "ui.camera": {
    nb: "Kamera",
    en: "Camera",
  },
  "ui.radar_detection": {
    nb: "Radardeteksjon",
    en: "Radar detection",
  },
  "ui.hyperspectral_camera": {
    nb: "Hyperspektralt kamera",
    en: "Hyperspectral camera",
  },
  "ui.communications": {
    nb: "Kommunikasjon",
    en: "Communications",
  },
  "ui.sun_sensor": {
    nb: "Solsensor",
    en: "Sun sensor",
  },
  "ui.radio_link": {
    nb: "Radioforbindelse",
    en: "Radio link",
  },
  "ui.3d_view_requires_webgl": {
    nb: "3D-visning krever WebGL",
    en: "3D view requires WebGL",
  },
  "ui.the_satellite_orbits_below_about_2_000_km_and_typically_takes_around_9": {
    nb: "Satellitten går under omtrent 2 000 km over jorda og bruker typisk rundt halvannen time per omløp. Mange norske satellitter går nær polene og observerer nye områder mens jorda roterer.",
    en: "The satellite orbits below about 2,000 km and typically takes around 90 minutes per orbit. Many Norwegian satellites pass close to the poles and observe new areas as the Earth rotates.",
  },
  "ui.about_35_786_km_above_the_equator_the_satellite_completes_an_orbit_in_": {
    nb: "Omtrent 35 786 km over ekvator. Satellitten bruker ett døgn per omløp og holder seg over samme sted på jorda. Det gir kontinuerlig dekning av et område.",
    en: "About 35,786 km above the equator. The satellite completes an orbit in one day and stays above the same location, providing continuous regional coverage.",
  },
  "ui.an_elongated_orbit_the_satellite_moves_slowest_farthest_from_earth_all": {
    nb: "En avlang bane. Satellitten beveger seg saktest lengst fra jorda og kan derfor dekke nordområdene i mange timer. ASBM bruker denne typen bane.",
    en: "An elongated orbit. The satellite moves slowest farthest from Earth, allowing many hours of coverage of northern regions. ASBM uses this type of orbit.",
  },
  "ui.ships_transmit_ais_messages_to_the_satellite": {
    nb: "Skip sender AIS-meldinger opp til satellitten.",
    en: "Ships transmit AIS messages to the satellite.",
  },
  "ui.the_satellite_receives_signals_from_ships_navigation_radars_it_does_no": {
    nb: "Satellitten fanger opp signaler fra skipenes navigasjonsradar. Den sender ikke radar ned mot havet.",
    en: "The satellite receives signals from ships’ navigation radars. It does not transmit radar towards the sea.",
  },
  "ui.the_camera_records_light_from_the_surface_the_pyramid_and_footprint_il": {
    nb: "Kameraet registrerer lys fra bakken. Pyramiden og bildefeltet viser prinsippet; størrelse og pekeretning er skjematiske.",
    en: "The camera records light from the surface. The pyramid and footprint illustrate the principle; their size and direction are schematic.",
  },
  "ui.the_camera_records_one_narrow_line_at_a_time_the_satellites_motion_bui": {
    nb: "Kameraet registrerer én smal linje av gangen. Satellittens bevegelse bygger opp bildet.",
    en: "The camera records one narrow line at a time. The satellite’s motion builds up the image.",
  },
  "ui.signals_travel_between_the_ground_and_satellite_in_both_directions_the": {
    nb: "Signaler går mellom bakken og satellitten i begge retninger. Forbindelsene er skjematiske.",
    en: "Signals travel between the ground and satellite in both directions. The links are schematic.",
  },
  "ui.the_sun_sensor_measures_the_direction_of_the_sun_and_helps_determine_t": {
    nb: "Solsensoren registrerer retningen til sola og hjelper satellitten å bestemme orienteringen.",
    en: "The sun sensor measures the direction of the Sun and helps determine the satellite’s orientation.",
  },
  "ui.a_schematic_radio_link_shows_how_the_satellite_sends_experimental_data": {
    nb: "En skjematisk radioforbindelse viser hvordan satellitten sender forsøksdata og mottar kommandoer.",
    en: "A schematic radio link shows how the satellite sends experimental data and receives commands.",
  },
  "ui.the_animation_illustrates_how_it_works_rather_than_actual_signals_or_o": {
    nb: "Animasjonen viser virkemåten, ikke faktiske signaler eller pågående opptak.",
    en: "The animation illustrates how it works, rather than actual signals or ongoing observations.",
  },
  "ui.no_pass_above_10_during_the_next_three_days": {
    nb: "Ingen passering over 10° de neste tre døgnene.",
    en: "No pass above 10° during the next three days.",
  },
  "ui.waiting_for_orbital_data": {
    nb: "Venter på banedata.",
    en: "Waiting for orbital data.",
  },
  "ui.pass_in_progress": {
    nb: "Passeringen pågår nå",
    en: "Pass in progress",
  },
  "ui.loading_next_scheduled_launch": {
    nb: "Henter neste planlagte oppskyting …",
    en: "Loading next scheduled launch …",
  },
  "ui.launch_data_could_not_be_retrieved_see_the_official_launch_information": {
    nb: "Oppskytingsdata kunne ikke hentes. Se offisiell oppskytingsinformasjon.",
    en: "Launch data could not be retrieved. See the official launch information.",
  },
  "ui.no_upcoming_launch_recorded_in_the_data_source": {
    nb: "Ingen kommende oppskyting registrert i datakilden.",
    en: "No upcoming launch recorded in the data source.",
  },
  "ui.no_launches_recorded_for_the_satellites_in_this_viewer": {
    nb: "Ingen oppskytinger registrert for satellittene i denne viseren.",
    en: "No launches recorded for the satellites in this viewer.",
  },
  "ui.time_to_be_determined": {
    nb: "Tidspunkt ikke fastsatt",
    en: "Time to be determined",
  },
  "ui.launch_window_unspecified_see_source": {
    nb: "Tidsvindu ikke presisert – se kilden",
    en: "Launch window unspecified – see source",
  },
  "ui.scheduled": {
    nb: "Planlagt",
    en: "Scheduled",
  },
  "ui.norwegian_armed_forces": {
    nb: "Forsvaret",
    en: "Norwegian Armed Forces",
  },
  "ui.norwegian_mapping_authority": {
    nb: "Kartverket",
    en: "Norwegian Mapping Authority",
  },
  "ui.norwegian_coastal_administration": {
    nb: "Kystverket",
    en: "Norwegian Coastal Administration",
  },
  "ui.norwegian_space_agency": {
    nb: "Direktoratet for romvirksomhet",
    en: "Norwegian Space Agency",
  },
  "ui.owner_and_operator": {
    nb: "Eier og operatør",
    en: "Owner and operator",
  },
  "ui.orbital_data_unavailable": {
    nb: "Banedata utilgjengelig",
    en: "Orbital data unavailable",
  },
  "ui.orbital_elements": {
    nb: "Bane ",
    en: "Orbital elements ",
  },
  "ui.satellite_data_reception_and_contact_with_satellites_through_ksats_glo": {
    nb: "Mottak av satellittdata og kontakt med satellitter i KSATs globale nettverk.",
    en: "Satellite data reception and contact with satellites through KSAT’s global network.",
  },
  "ui.teleport_for_satellite_communications_traffic_monitoring_and_operation": {
    nb: "Teleport for satellittkommunikasjon, trafikkovervåking og drift.",
    en: "Teleport for satellite communications, traffic monitoring and operations.",
  },
  "ui.military_satellite_communications": {
    nb: "Militær satellittkommunikasjon og samband.",
    en: "Military satellite communications.",
  },
  "ui.geodetic_measurements_of_the_earths_shape_motion_and_orientation_in_sp": {
    nb: "Geodetiske målinger av jordas form, bevegelse og orientering i rommet.",
    en: "Geodetic measurements of the Earth’s shape, motion and orientation in space.",
  },
  "ui.norwegian_operations_norwegian_dutch_missions": {
    nb: "Norsk drift · norske/nederlandske oppdrag",
    en: "Norwegian operations · Norwegian/Dutch missions",
  },
  "ui.ended": {
    nb: "Avsluttet",
    en: "Ended",
  },
  "ui.see_source": {
    nb: "Se kilde",
    en: "See source",
  },
  "ui.original_design_lifetime_not_remaining_service_life": {
    nb: "Opprinnelig forventet levetid, ikke gjenværende driftstid",
    en: "Original design lifetime, not remaining service life",
  },
  "ui.launch_source": {
    nb: "Kilde til oppskytingen",
    en: "Launch source",
  },
  "ui.show_orbits_for_all_satellites_with_available_orbital_data": {
    nb: "Vis banene til alle satellitter med tilgjengelige banedata",
    en: "Show orbits for all satellites with available orbital data",
  },
  "ui.explore_orbits": {
    nb: "Utforsk banene",
    en: "Explore orbits",
  },
  "ui.no_orbit": {
    nb: "Uten bane",
    en: "No orbit",
  },
  "ui.simplified_illustration_of_name": {
    nb: "Forenklet illustrasjon av {name}",
    en: "Simplified illustration of {name}",
  },
  "ui.next_scheduled_launch_name_date_status_schedule_subject_to_change": {
    nb: "Neste planlagte: {name} · {date} · {status}. Tidspunkt kan endres.",
    en: "Next scheduled launch: {name} · {date} · {status}. Schedule subject to change.",
  },
  "ui.retrieved_date_launch_library_2": {
    nb: "Hentet {date} · Launch Library 2",
    en: "Retrieved {date} · Launch Library 2",
  },
  "ui.no_earlier_than_year": {
    nb: "Tidligst {year}",
    en: "No earlier than {year}",
  },
  "ui.quarter_quarter_year": {
    nb: "{quarter}. kvartal {year}",
    en: "Quarter {quarter} {year}",
  },
  "ui.date_norwegian_time": {
    nb: "{date} norsk tid",
    en: "{date} Norwegian time",
  },
  "ui.name_stays_above_10_elevation_throughout_the_checked_period": {
    nb: "{name} ligger over 10° horisontshøyde gjennom hele perioden vi sjekker.",
    en: "{name} stays above 10° elevation throughout the checked period.",
  },
  "ui.in_when_date_norwegian_time": {
    nb: "Om {when} · {date} (norsk tid)",
    en: "In {when} · {date} (Norwegian time)",
  },
  "ui.pass_max_elevation_above_the_horizon": {
    nb: "{pass} · Maks {elevation}° over horisonten.",
    en: "{pass} · Max {elevation}° above the horizon.",
  },
  "ui.open_spaceport_name": {
    nb: "Åpne romhavnen {name}",
    en: "Open spaceport {name}",
  },
  "ui.open_ground_station_name": {
    nb: "Åpne bakkestasjonen {name}",
    en: "Open ground station {name}",
  },
  "ui.ground_station_at_name": {
    nb: "Bakkestasjonen i {name}",
    en: "Ground station at {name}",
  },
  "ui.illustration_of_a_ground_station_antenna": {
    nb: "Illustrasjon av en bakkeantenne",
    en: "Illustration of a ground station antenna",
  },
  "ui.schematic_illustration_not_a_photograph_of_the_facility": {
    nb: "Skjematisk illustrasjon, ikke et foto av anlegget",
    en: "Schematic illustration, not a photograph of the facility",
  },
  "ui.photo_name": {
    nb: "Foto: {name}",
    en: "Photo: {name}",
  },
  "ui.display_language": {
    nb: "Visningsspråk",
    en: "Display language",
  },
  "ui.france_cnes_esa_owns_dedicated_ariane_and_vega_infrastructure": {
    nb: "Frankrike / CNES; ESA eier dedikert Ariane- og Vega-infrastruktur",
    en: "France / CNES; ESA owns dedicated Ariane and Vega infrastructure",
  },
  "ui.kourou_and_sinnamary_french_guiana": {
    nb: "Kourou og Sinnamary · Fransk Guyana",
    en: "Kourou and Sinnamary · French Guiana",
  },
  "ui.nordmela_andya_norway": {
    nb: "Nordmela, Andøya · Norge",
    en: "Nordmela, Andøya · Norway",
  },
  "ui.baikonur_kazakhstan": {
    nb: "Baikonur, Kasakhstan",
    en: "Baikonur, Kazakhstan",
  },
  "ui.kourou_french_guiana": {
    nb: "Kourou, Fransk Guyana",
    en: "Kourou, French Guiana",
  },
  "ui.andya_norway": {
    nb: "Andøya, Norge",
    en: "Andøya, Norway",
  },
  "ui.3_years": {
    nb: "3 år",
    en: "3 years",
  },
  "ui.5_years": {
    nb: "5 år",
    en: "5 years",
  },
  "ui.7_years": {
    nb: "7 år",
    en: "7 years",
  },
  "ui.15_years": {
    nb: "15 år",
    en: "15 years",
  },
  "ui.approx_15_years": {
    nb: "Ca. 15 år",
    en: "Approx. 15 years",
  },
  "ui.march_2026": {
    nb: "Mars 2026",
    en: "March 2026",
  },
  "ui.hours_h_minutes_min": {
    nb: "{hours} t {minutes} min",
    en: "{hours} h {minutes} min",
  },
  "ui.name_explanation": {
    nb: "{name} · Forklaring",
    en: "{name} · Explanation",
  },
  "credit.satellite_32487_credit": {
    nb: "Illustrasjon: THOR 5",
    en: "Illustration: THOR 5",
  },
  "credit.satellite_36033_credit": {
    nb: "Illustrasjon: THOR 6",
    en: "Illustration: THOR 6",
  },
  "credit.satellite_40613_credit": {
    nb: "Illustrasjon: THOR 7",
    en: "Illustration: THOR 7",
  },
  "credit.satellite_42826_credit": {
    nb: "Bilde: Romdirektoratet",
    en: "Bilde: Romdirektoratet",
  },
  "credit.satellite_42828_credit": {
    nb: "Illustrasjon: NorSat-1 og -2",
    en: "Illustration: NorSat-1 and -2",
  },
  "credit.satellite_48272_credit": {
    nb: "Bilde: Romdirektoratet",
    en: "Bilde: Romdirektoratet",
  },
  "credit.satellite_55015_credit": {
    nb: "Illustrasjon: NanoAvionics",
    en: "Illustration: NanoAvionics",
  },
  "credit.satellite_55093_credit": {
    nb: "Illustrasjon: MilSpace2",
    en: "Illustration: MilSpace2",
  },
  "credit.satellite_55093_alt": {
    nb: "Prosjektillustrasjon av tvillingsatellittene Birkeland og Huygens",
    en: "Project illustration of the twin satellites Birkeland and Huygens",
  },
  "credit.satellite_60422_credit": {
    nb: "Illustrasjon: ASBM 1 og 2",
    en: "Illustration: ASBM 1 and 2",
  },
  "credit.satellite_60422_alt": {
    nb: "Felles illustrasjon av satellittplattformen til ASBM 1 og 2",
    en: "Felles illustrasjon av satellittplattformen til ASBM 1 and 2",
  },
  "credit.satellite_60423_credit": {
    nb: "Illustrasjon: ASBM 1 og 2",
    en: "Illustration: ASBM 1 and 2",
  },
  "credit.satellite_60423_alt": {
    nb: "Felles illustrasjon av satellittplattformen til ASBM 1 og 2",
    en: "Felles illustrasjon av satellittplattformen til ASBM 1 and 2",
  },
  "credit.satellite_60531_credit": {
    nb: "Foto: NTNU SmallSat Lab",
    en: "Photo: NTNU SmallSat Lab",
  },
  "credit.satellite_62702_credit": {
    nb: "Illustrasjon: SFL",
    en: "Illustration: SFL",
  },
  "credit.satellite_68454_credit": {
    nb: "Illustrasjon: AISSat-4",
    en: "Illustration: AISSat-4",
  },
  "credit.satellite_68490_credit": {
    nb: "Illustrasjon: Mimir-1",
    en: "Illustration: Mimir-1",
  },
  "credit.station_0": {
    nb: "Foto: KSAT",
    en: "Photo: KSAT",
  },
  "credit.station_1": {
    nb: "Foto: KSAT",
    en: "Photo: KSAT",
  },
  "credit.station_21": {
    nb: "Foto: Space Norway",
    en: "Photo: Space Norway",
  },
  "credit.station_24": {
    nb: "Foto: Bjørn-Owe Holmberg / Kartverket",
    en: "Photo: Bjørn-Owe Holmberg / Kartverket",
  },
  "ui.stop_following": {
    nb: "Stopp følging",
    en: "Stop following",
  },
  "ui.how_satellite_works": {
    nb: "Slik virker satellitten",
    en: "How the satellite works",
  },
  "ui.orbit_old": {
    nb: "Banedata er eldre enn 7 dager. Posisjonen er mer usikker.",
    en: "Orbital data is over 7 days old. Position is less certain.",
  },
  "ui.orbit_refresh_failed": {
    nb: "Kunne ikke hente nye banedata. Viser sist tilgjengelige data.",
    en: "Could not retrieve new orbital data. Showing last available data.",
  },
  "ui.orbit_epoch_label": {
    nb: "Banedataenes tidspunkt: ",
    en: "Orbital data epoch: ",
  },
};
