#!/bin/bash

# This script represents a much easier way to perform autograding on moodle

# First download all submissions from moodle and unzip
# Put this file in the top level of the unzipped folder

# The exercise folder containing the test.py file
UNITTEST="/Users/jmadar/Documents/env3d/python-web-submission/labs/lab1/test.py"

# copy from template the test file to each user's directory
ls -d */ | awk -F, -v UNITTEST="$UNITTEST" '{print "cp " UNITTEST " \"" $1 "\""}' | bash

DIRS=$(ls -d */)

oldIFS="$IFS"
IFS=$'\n'

echo -n "" > _grades.csv

# go into each directory and run test
for DIR in $DIRS
do
    cd $DIR
    OUTPUT=$(python3 test.py 2>&1 | head -n 1)
    TOTAL=$(echo -n $OUTPUT | wc -m | awk '{print $1}')
    SUCCESS=$(echo -n $OUTPUT | tr -d F | wc -m | awk '{print $1}') 
    FAILURES=$(echo -n $OUTPUT | tr -d . | wc -m | awk '{print $1}')
    #echo "TOTAL: $TOTAL, SUCCESS: $SUCCESS, FAILURES: $FAILURES"
    SCORE=$(echo "scale=2; $SUCCESS / $TOTAL * 100" | bc)
    SCORE_OUTPUT=$(echo "$DIR$SCORE" | awk -F[_/] '{print "\"Participant " $2"\","$5}')
    cd ..
    
    # Record the score
    echo $SCORE_OUTPUT >> _grades.csv
done


IFS="$oldIFS"
rm _grades.csv
