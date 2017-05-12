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

		counter = 0
		Data = []

		# Iterate over each row in datafile
		for row in datareader:

			Data.append({})

			Data[counter]["place"] = row[0]
			Data[counter]["date"] = row[1]
			Data[counter]["humidMin"] = row[4]
			Data[counter]["humidMax"] = row[3]
			Data[counter]["humidMean"] = row[2]

			counter += 1


	# Create json file and write data to it
	with open("JSONDATA.json", 'w') as OutputFile:
		json.dump(Data, OutputFile)


if __name__ == '__main__':
	main()