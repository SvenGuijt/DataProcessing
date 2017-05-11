# Sven Guijt, student nr. 10597751
# Data Processing, Minor Programmeren, UvA 


import csv, json

def main():
	with open('KNMIdata.csv') as csvfile:


		# Check whether datafile contains header and if so, skip
		if csv.Sniffer().has_header(csvfile.read(5)):
			next(csvfile)

		# Read in csv file
		datareader = csv.reader(csvfile, delimiter=",")

		counter = 1
		blankData = {}
		blankData["city1"] = "Hupsel"
		blankData["city2"] = "Beerta"
		blankData["values1"] = {}
		blankData["values2"] = {}


		# Iterate over each row in datafile
		for row in datareader:

			currentValue = "value"+str(counter)

			if row[0] == blankData["city1"]:
				blankData["values1"][currentValue] = {}
				blankData["values1"][currentValue]["date"] = row[1]
				blankData["values1"][currentValue]["HumidMin"] = row[4]
				blankData["values1"][currentValue]["HumidMax"] = row[3]
				blankData["values1"][currentValue]["HumidMean"] = row[2]
			else:
				counter = 1
				currentValue = "value"+str(counter)
				blankData["values2"][currentValue] = {}
				blankData["values2"][currentValue]["date"] = row[1]
				blankData["values2"][currentValue]["HumidMin"] = row[4]
				blankData["values2"][currentValue]["HumidMax"] = row[3]
				blankData["values2"][currentValue]["HumidMean"] = row[2]

			counter += 1



# Data to look like this:

#		"city1": "Moergestel",
#		"values1": {
#		value1: {"date": 20160101, "vochtGem": 95, "vochtMin": 90, "vochtMin": 85}
#		value2: {"date": 20160102, "vochtGem": 95, "vochtMin": 90, "vochtMin": 85}
#		value3: {"date": 20160103, "vochtGem": 95, "vochtMin": 90, "vochtMin": 85}
#		value4: {"date": 20160104, "vochtGem": 95, "vochtMin": 90, "vochtMin": 85}
#		}
#		"city2": "Oisterwijk",
#		"values2": {
#		value1: {"date": 20160101, "vochtGem": 95, "vochtMin": 90, "vochtMin": 85}
#		value2: {"date": 20160102, "vochtGem": 95, "vochtMin": 90, "vochtMin": 85}
#		value3: {"date": 20160103, "vochtGem": 95, "vochtMin": 90, "vochtMin": 85}
#		value4: {"date": 20160104, "vochtGem": 95, "vochtMin": 90, "vochtMin": 85}
#		}





	# Create json file and write data to it
	with open("JSONDATA.json", 'w') as OutputFile:
		json.dump(blankData, OutputFile)


if __name__ == '__main__':
	main()