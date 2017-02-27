#!/usr/bin/python

from os.path import join

import os
import sys

import timeit
import time

import numpy

import binascii
import socket
import struct
import sys

HOST = 'localhost'        # Symbolic name meaning all available interfaces
PORT = 50007              # Arbitrary non-privileged port


import time, datetime, sys
import numpy as np
import h5py

import pickle

import keras
from keras.models import model_from_json


def run_classifier(model_json, model_weights, normalisation_file, result_dir, pickle_files):


    datadim = 30
    timesteps = 63
    nb_classes = 41
    
    batch_size=128
    nb_epoch=30


    loadstartmoment= time.clock()


    print ( "init model from json..." )
    model = model_from_json(open(model_json).read())
    
    print ( "Load weigths from h5py..." )
    model.load_weights(model_weights)


    model.compile(optimizer='rmsprop', 
                  loss='categorical_crossentropy',
                  metrics=['accuracy'])

    print ( "Load normalisation stats fom h5py..." )
    norm=pickle.load(open(normalisation_file,'rb'),encoding='latin1')
    norm_means=norm['mean']
    norm_stds=norm['std']

    loadtime = time.clock()-loadstartmoment
    print ("Loading took %0.1f seconds!"%loadtime)

    


    # Connection handling! #
    # Get data from socket and do it!
    
    for pickle_file in pickle_files:
        print ("Load and classify "+pickle_file)

        data = pickle.load(open(pickle_file,'rb'),encoding='latin1')

        
        test_x = data['data']
        test_y = data['classes']


        #print "Length of data: "+str(len(data))
        #print 'Received data: "%s"' % binascii.hexlify(data)


        test_x = (test_x-norm_means)/norm_stds
        
        teststartmoment= time.clock()

        return_data = model.evaluate(test_x, test_y, batch_size=batch_size)
        print ("%s\t%f\t%f" % (os.path.basename(pickle_file), return_data[0], return_data[1]))

        predict = model.predict(test_x, batch_size=batch_size)


        #print (np.argmax(return_data,1))

        np.savetxt(result_dir+'/%s.guess' % os.path.basename(pickle_file), predict)
        np.savetxt(result_dir+'%s.ref'% os.path.basename(pickle_file), np.argmax(test_y,1))

        testtime = time.clock()-teststartmoment





if __name__ == '__main__':

    model_arch=sys.argv[1]
    model_weights=sys.argv[2]
    model_norm=sys.argv[3]
    result_dir = sys.argv[4]
    pickle_files = sys.argv[5:]


    run_classifier( model_arch, model_weights, model_norm, result_dir, pickle_files)
    
