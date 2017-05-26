# Sven Guijt, student nr. 10597751
# Data Processing, Minor Programmeren, UvA 


import csv, json

def main():
	with open('data_files/primarydata.csv') as csvfile:


		# Check whether datafile contains header and if so, skip
		if csv.Sniffer().has_header(csvfile.read(5)):
			next(csvfile)

		# Read in csv file
		datareader = csv.reader(csvfile, delimiter=",")

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

	# Create json file and write data to it
	with open("data_files/JSONprimarydata.json", 'w') as OutputFile:
		json.dump(data, OutputFile)


if __name__ == '__main__':
	main()