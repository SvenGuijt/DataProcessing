# Sven Guijt, student nr. 10597751
# Data Processing, Minor Programmeren, UvA 


import csv, json

def main():
	with open('D3DATA.csv') as csvfile:

		# Check whether datafile contains header and if so, skip
		if csv.Sniffer().has_header(csvfile.read(50)):
			next(csvfile)

		# Read in csv file
		datareader = csv.reader(csvfile, delimiter=",")

		DataPerMonth = [{"Month": "January", 	"Rain":0}, 
						{"Month": "February", 	"Rain":0}, 
						{"Month": "March", 		"Rain":0}, 
						{"Month": "April", 		"Rain":0}, 
						{"Month": "May", 		"Rain":0}, 
						{"Month": "June", 		"Rain":0}, 
						{"Month": "July", 		"Rain":0}, 
						{"Month": "August", 	"Rain":0}, 
						{"Month": "September", 	"Rain":0}, 
						{"Month": "October", 	"Rain":0}, 
						{"Month": "November", 	"Rain":0}, 
						{"Month": "December", 	"Rain":0}]

		# Iterate over each row in datafile
		for row in datareader:

			# Parse second column to int and check the data
			row[1] = int(row[1])
			if row[1] == -1:
				row[1] = 0

			# Read rain data into data array
			DataPerMonth[int(row[0][4:6])-1]["Rain"] += row[1]

	# Create json file and write data to it
	with open("JSONDATA.json", 'w') as OutputFile:
		json.dump(DataPerMonth, OutputFile)


if __name__ == '__main__':
	main()