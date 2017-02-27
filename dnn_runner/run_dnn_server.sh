#!/bin/bash


modeldir=`pwd`/dnn_runner/models/l3002_d0.6-2016-09-06 #l2501_d0.4-2016-08-23

modelarch=$modeldir/architecture.json
modelparam=$modeldir/weights.04-2.39_0.37-1.88_0.48.hdf5 #weights.07-2.34_0.40-1.94_0.49.hdf5
normfile=$modeldir/norm


source activate tensorflow3
python dnn_runner/classify_server.py $modelarch $modelparam $normfile
