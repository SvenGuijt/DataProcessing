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

		DataPerMonth = [["January",0], ["February",0], ["March",0], ["April",0], ["May",0], ["June",0], ["July",0], ["August",0], ["September",0], ["Octobre",0], ["November",0], ["December",0]]

		# Iterate over each row in datafile
		for row in datareader:

			# Parse second column to int and check the data
			row[1] = int(row[1])
			if row[1] == -1:
				row[1] = 0
			print(row)

			DataPerMonth[int(row[0][4:6])-1][1] += row[1]


		print(DataPerMonth)

	Data = {}

	for i in range(len(DataPerMonth)):
		Data[DataPerMonth[i][0]] = DataPerMonth[i][1]
	print(Data)

	with open("JSONDATA.txt", 'w') as OutputFile:
		json.dump(Data, OutputFile)


if __name__ == '__main__':
	main()