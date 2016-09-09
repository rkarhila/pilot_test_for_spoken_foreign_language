#!/bin/bash

usercode=$1;

recipe=dnn_runner/recipes/$usercode
statsdir=classification_data/stats/$usercode
pickle=classification_data/pickles/$usercode
resultdir=classification_data/results/
resultfiledir=classification_data/results_charts/

phonesampleaudiodir=public/phone_samples/$usercode

# Make a little recipe:



date

> $recipe
for labfile in uploads/validator_data/$usercode/*.lab; do
    wavfile=uploads/validator_data/$usercode/$usercode.`basename $labfile .lab`.wav
    if [ -f $wavfile ]; then 
	echo "audio=`pwd`/$wavfile alignment=`pwd`/$labfile" >> $recipe
    else
	echo "$wavfile does not exist!"
    fi
done 

mkdir -p $statsdir
mkdir -p $resultdir

echo python dnn_runner/extract_and_pickle_from_wavfiles.py --recipe $recipe --pickle $pickle --stats $statsdir

python dnn_runner/extract_and_pickle_from_wavfiles.py --recipe $recipe --pickle $pickle --stats $statsdir

mkdir -p $phonesampleaudiodir

for f in $statsdir/control-wav/*raw; do 
    sox -t raw --encoding signed-integer -b 16 -r 16000 $f $phonesampleaudiodir/`basename $f .16k.16b.signed_integer.raw`.wav
done &




modeldir=`pwd`/dnn_runner/models/l3002_d0.6-2016-09-06 #l2501_d0.4-2016-08-23

modelarch=$modeldir/architecture.json
modelparam=$modeldir/weights.04-2.39_0.37-1.88_0.48.hdf5 #weights.07-2.34_0.40-1.94_0.49.hdf5
normfile=$modeldir/norm




date
 
source activate tensorflow3

python dnn_runner/classify.py $modelarch $modelparam $normfile $resultdir $pickle 

date



source deactivate tensorflow3

python dnn_runner/evaluate_results_and_write_html.py $usercode $resultfiledir/$usercode


