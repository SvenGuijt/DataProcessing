#!/usr/bin/env python
# Name: Sven Guijt
# Student number: 10597751
'''
This script scrapes IMDB and outputs a CSV file with highest rated tv series.
'''
import csv

from pattern.web import URL, DOM

TARGET_URL = "http://www.imdb.com/search/title?num_votes=5000,&sort=user_rating,desc&start=1&title_type=tv_series"
BACKUP_HTML = 'tvseries.html'
OUTPUT_CSV = 'tvseries.csv'


def extract_tvseries(dom):
    '''
    Extract a list of highest rated TV series from DOM (of IMDB page).

    Each TV series entry should contain the following fields:
    - TV Title
    - Rating
    - Genres (comma separated if more than one)
    - Actors/actresses (comma separated if more than one)
    - Runtime (only a number!)
    '''

    # ADD YOUR CODE HERE TO EXTRACT THE ABOVE INFORMATION ABOUT THE
    # HIGHEST RATED TV-SERIES
    # NOTE: FOR THIS EXERCISE YOU ARE ALLOWED (BUT NOT REQUIRED) TO IGNORE
    # UNICODE CHARACTERS AND SIMPLY LEAVE THEM OUT OF THE OUTPUT.

    titles = []
    runtimes = []
    genres = []
    ratings = []
    actors = []

    for item in dom.by_tag("div.lister-list")[:1]:
        data = item.by_tag("div.lister-item-content")[0]
        header = data.by_tag("h3.lister-item-header")[0]

        titles[item] = header.by_tag("a")[0].content
        #print header.by_tag("a")[0].content #title
        info = data.by_tag("p.text-muted")[0]
        #print info.by_tag("span.runtime")[0].content.strip("min") #runtime
        runtimes[item] = info.by_tag("span.runtime")[0].content.strip("min")

        #print info.by_tag("span.genre")[0].content #genre
        genres[item] = info.by_tag("span.genre")[0].content

        rating = data.by_tag("div.ratings-bar")[0]
        #print rating.by_tag("div.inline-block ratings-imdb-rating")[0].attrs["data-value"] #rating
        ratings[item] = rating.by_tag("div.inline-block ratings-imdb-rating")[0].attrs["data-value"]

        stars = data.by_tag("p")[2]
        for star in stars.by_tag("a"):
            actors[item] = star.content
            #print star.content




    return titles, runtimes, genres, ratings, actors  # replace this line as well as appropriate


def save_csv(f, tvseries):
    '''
    Output a CSV file containing highest rated TV-series.
    '''
    writer = csv.writer(f)
    writer.writerow(['Title', 'Rating', 'Genre', 'Actors', 'Runtime'])
    for i in titles:
        writer.writerow([titles[i], ratings[i], genres[i], actors[i], runtimes[i]])

    # ADD SOME CODE OF YOURSELF HERE TO WRITE THE TV-SERIES TO DISK

if __name__ == '__main__':
    # Download the HTML file
    url = URL(TARGET_URL)
    html = url.download()

    # Save a copy to disk in the current directory, this serves as an backup
    # of the original HTML, will be used in grading.
    with open(BACKUP_HTML, 'wb') as f:
        f.write(html)

    # Parse the HTML file into a DOM representation
    dom = DOM(html)

    # Extract the tv series (using the function you implemented)
    tvseries = extract_tvseries(dom)

    # Write the CSV file to disk (including a header)
    with open(OUTPUT_CSV, 'wb') as output_file:
        save_csv(output_file, tvseries)