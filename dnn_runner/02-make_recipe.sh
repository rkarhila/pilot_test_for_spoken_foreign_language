#!/bin/bash

# What to do here?

labdir="/teamwork/t40511_asr/p/digitala/interspeech_demo/dnn_testing/akus_new_test_labs/testDir"

recipedir="/teamwork/t40511_asr/p/digitala/interspeech_demo/dnn_testing/recipes"

#find /teamwork/t40511_asr/c/digitala/first_round_wav_segments_again/* \
# -type d | while read d; do \
# sp=`basename $d`;
# echo $sp
# for f in $d/*wav; do
# lab="$labdir/`echo $f | sed -r 's/.*(munkka|olari)(.....).*/\1\2/'`/`basename $f .phn.wav`.lab"; \
# if [ -f $lab ]; then echo "audio=$f alignment=$lab";fi; done > recipes/$sp.recipe
#done

for dir in $labdir/stig*; do
 echo $dir
 sp=`basename $dir`
 find $dir/ -name "*.lab" | while read lab; do
  labbase=`basename $lab .lab`
  wav="/teamwork/t40511_asr/p/digitala/interspeech_demo//model_ponunc/wav/stig.sentence-$labbase.wav"
  if [ -f  "$wav" ]; then
   echo "audio=$wav alignment=$lab";
  fi
 done > recipes/$sp.recipe
done



for dir in $labdir/olari* $labdir/munkka*; do
 echo $dir
 sp=`basename $dir`
 find $dir/ -name "*.lab" | while read lab; do
  labbase=`basename $lab .lab`
  wav="/teamwork/t40511_asr/c/digitala/first_round_wav_segments_yet_again/split/$sp-$labbase.wav"
  if [ -f  "$wav" ]; then 
   echo "audio=$wav alignment=$lab"; 
  fi
 done > recipes/$sp.recipe
done


