# Sven Guijt, student nr. 10597751
# Data Processing, Minor Programmeren, UvA 


import csv, json

def main():
	with open('data_files/primarydataWOMEN.csv') as csvfile:
		with open('data_files/secondarydataWOMEN.csv') as csvfile2:


			# Check whether datafile contains header and if so, skip
			if csv.Sniffer().has_header(csvfile.read(5)):
				next(csvfile)

			# Read in csv file
			datareader = csv.reader(csvfile, delimiter=",")

			# Check whether datafile contains header and if so, skip
			if csv.Sniffer().has_header(csvfile2.read(5)):
				next(csvfile2)

			# Read in csv file
			datareader2 = csv.reader(csvfile2, delimiter=",")

			data = {}
			classes = [76,77,78,79,80,81]

			# Iterate over each row in datafile
			for row in datareader:

				data[row[0]] = {}
				data[row[0]]["Country"] = row[1]
				data[row[0]]["LifeExp"] = row[2]
				fillKey = int(float(row[2]))
				if fillKey <= 76:
					fillKey = "<" + str(76)
				elif fillKey >= 82:
					fillKey = str(82) + ">"
				data[row[0]]["fillKey"] = str(fillKey)

			# Iterate over each row in datafile
			for row in datareader2:
				data[row[0]]["DWBF"] = row[2]
				data[row[0]]["EmpRate"] = row[3]
				data[row[0]]["pEarn"] = row[4]
				data[row[0]]["QOSN"] = row[5]
				data[row[0]]["YearsEdu"] = row[6]
				data[row[0]]["AirPol"] = row[7]
				data[row[0]]["WaterQ"] = row[8]
				data[row[0]]["SRHealth"] = row[9]
				data[row[0]]["LifeSatis"] = row[10]
				data[row[0]]["Safe"] = row[11]
				data[row[0]]["HomRate"] = row[12]

	# Create json file and write data to it
	with open("data_files/JSONdataWOMEN.json", 'w') as OutputFile:
		json.dump(data, OutputFile)


if __name__ == '__main__':
	main()