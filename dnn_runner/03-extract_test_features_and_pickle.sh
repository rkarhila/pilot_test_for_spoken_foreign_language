#!/bin/bash

# I need to use this to get the waveforms, one at a time:
# ./extract_wav.py eval.scp 04682001-0003-598-1 | sox - /tmp/se.wav


# Recipes:
# /teamwork/t40511_asr/p/digitala/models1/train.scp
# /teamwork/t40511_asr/p/digitala/models1/eval.scp
# /teamwork/t40511_asr/p/digitala/models1/dev.scp

LOCALWORK=/l/$USER/sw_phoneme_dnn/

PICKLDIR=$LOCALWORK/pickles_testbirds
mkdir -p $PICKLDIR

RECIPEDIR=/teamwork/t40511_asr/p/digitala/interspeech_demo/dnn_testing/recipes/

for recipe in $RECIPEDIR/*recipe; do
sp=`basename $recipe .recipe | sed -r 's/\-sv.*//g'`
mkdir -p $PICKLDIR/$sp.stats
echo $sp
python extract_and_pickle_from_wavfiles.py \
 --recipe $recipe \
 --pickle $PICKLDIR/$sp.pickle --stats $PICKLDIR/$sp.stats
done
# --align /teamwork/t40511_asr/p/digitala/interspeech_demo/dnn_testing/all_speakers.align \

#python extract_and_pickle.py --recipe /teamwork/t40511_asr/p/digitala/models1/train.scp \
# --align $LOCALWORK/phones-dev.ctm --pickle $PICKLDIR/dev --stats $PICKLDIR/dev-stats

#python extract_and_pickle.py --recipe /teamwork/t40511_asr/p/digitala/models1/train.scp \
# --align $LOCALWORK/phones-eval.ctm --pickle $PICKLDIR/eval --stats $PICKLDIR/eval-stats


