# Sven Guijt, student nr. 10597751
# Data Processing, Minor Programmeren, UvA 


import csv
with open('D3DATA.csv') as csvfile:
	datareader = csv.reader(csvfile, delimiter=",", quotechar = "'")
	for row in datareader:
		print(row)