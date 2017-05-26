

d3.queue()
	.defer(d3.csv, "data_files/data.csv")
	.defer(d3.csv, "data_files/data.csv")
	.defer(d3.csv, "data_files/data.csv")
	.await(makelinked_views)

