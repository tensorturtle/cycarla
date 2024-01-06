import xml.etree.ElementTree as ET
from xml.dom import minidom

class GPXCreator:
    def __init__(self, creator_name="CycarlaGPX"):
        self.gpx = ET.Element("gpx", {
            "creator": creator_name,
            "version": "1.1",
            "xmlns": "http://www.topografix.com/GPX/1/1",
            "xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
            "xsi:schemaLocation": "http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd http://www.garmin.com/xmlschemas/GpxExtensions/v3 http://www.garmin.com/xmlschemas/GpxExtensionsv3.xsd http://www.garmin.com/xmlschemas/TrackPointExtension/v1 http://www.garmin.com/xmlschemas/TrackPointExtensionv1.xsd",
            "xmlns:gpxtpx": "http://www.garmin.com/xmlschemas/TrackPointExtension/v1",
            "xmlns:gpxx": "http://www.garmin.com/xmlschemas/GpxExtensions/v3"
        })

        self.metadata = ET.SubElement(self.gpx, "metadata")
        self.trk = ET.SubElement(self.gpx, "trk")
        self.trkseg = ET.SubElement(self.trk, "trkseg")

    def set_metadata_time(self, time):
        time_element = ET.SubElement(self.metadata, "time")
        time_element.text = time

    def set_track_info(self, name, type):
        name_element = ET.SubElement(self.trk, "name")
        name_element.text = name

        type_element = ET.SubElement(self.trk, "type")
        type_element.text = type

    def add_trackpoint(self, lat, lon, ele, time, power=None, cadence=None):
        trkpt = ET.SubElement(self.trkseg, "trkpt", {"lat": str(lat), "lon": str(lon)})
        
        ele_element = ET.SubElement(trkpt, "ele")
        ele_element.text = str(ele)

        time_element = ET.SubElement(trkpt, "time")
        time_element.text = time

        if power is not None or cadence is not None:
            extensions = ET.SubElement(trkpt, "extensions")

        if power is not None:
            power_element = ET.SubElement(extensions, "power")
            power_element.text = str(power)

        if cadence is not None:
            cadence_element = ET.SubElement(extensions, "cadence")
            cadence_element.text = str(cadence)
        


    def to_string(self):
        rough_string = ET.tostring(self.gpx, 'utf-8')
        reparsed = minidom.parseString(rough_string)
        return reparsed.toprettyxml(indent="  ")

    def save_to_file(self, file_path):
        with open(file_path, "w") as file:
            file.write(self.to_string())
if __name__ == "__main__":
    # Example of using the class
    gpx_creator = GPXCreator()
    gpx_creator.set_metadata_time("2023-12-26T10:05:08Z")
    gpx_creator.set_track_info("Test GPS Activity", "VirtualRide")
    gpx_creator.add_trackpoint(46.8588220, 10.8724850, 1234.0, "2023-12-26T10:05:08Z", 70, 100)
    gpx_creator.add_trackpoint(46.8588225, 10.8724855, 1236.0, "2023-12-26T10:05:09Z", 75, 101)
    gpx_creator.add_trackpoint(46.8588230, 10.8724860, 1238.0, "2023-12-26T10:05:10Z", 80, 102)
    gpx_creator.add_trackpoint(46.8588235, 10.8724865, 1240.0, "2023-12-26T10:05:11Z")

    # Add more trackpoints as needed
    gpx_creator.save_to_file("output.gpx")
