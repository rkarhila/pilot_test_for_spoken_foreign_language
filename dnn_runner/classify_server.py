#!/usr/bin/env python

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

from classify_server_conf import HOST, PORT, terminator, datasplit, donemsg

import time, datetime, sys
import numpy as np
import h5py

import pickle

import keras
from keras.models import model_from_json

import threading


def run_classifier(model_json, model_weights, normalisation_file):


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
    
    def processClientSocket(clientsocket):
        
        data = ""
        while not terminator in data:
            print("Receiving data...")
            received = clientsocket.recv(2048)
            if not received:
                print("Error: socket closed")
                break
            data += received.decode('utf-8')
        if not terminator in data:
            clientsocket.close() 
            return
        meaningful_data = data.split(";")[0]
        result_dir = meaningful_data.split(",")[0]
        pickle_files = meaningful_data.split(",")[1:]

        for pickle_file in pickle_files:
            print ("Load and classify "+pickle_file)
            
            try:
                data = pickle.load(open(pickle_file,'rb'),encoding='latin1')
            except FileNotFoundError:
                print("ERROR: File not found:"+pickle_file)
                continue


            
            test_x = data['data']
            test_y = data['classes']


            #print "Length of data: "+str(len(data))
            #print 'Received data: "%s"' % binascii.hexlify(data)


            test_x = (test_x-norm_means)/norm_stds
            
            teststartmoment= time.time()

            #return_data = model.evaluate(test_x, test_y, batch_size=batch_size)
            #print ("%s\t%f\t%f" % (os.path.basename(pickle_file), return_data[0], return_data[1]))

            with keras.backend.get_session().graph.as_default():
                predict = model.predict(test_x, batch_size=batch_size)



            #print (np.argmax(return_data,1))

            np.savetxt(result_dir+'/%s.guess' % os.path.basename(pickle_file), predict)
            np.savetxt(result_dir+'%s.ref'% os.path.basename(pickle_file), np.argmax(test_y,1))

            testtime = time.time()-teststartmoment
            print("Test took: "+ str(testtime))
        clientsocket.close()
    


    # Connection handling! #
    # Get data from socket and do it!
    serversocket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    serversocket.bind((HOST, PORT))
    serversocket.listen(5)


    while True:
        clientsocket, address = serversocket.accept()
        print("NEW CLIENT: "+str(address))
        
        #To predict multiple data at the same time, run:
        #threading.Thread(target= processClientSocket, args=[clientsocket]).start()
        
        #To predict just one at a time, run:
        processClientSocket(clientsocket)
        
        #Multiple data at the same time is faster overall by a few seconds,
        #but one at a time is much faster for the first to arrive data. I recommed one at a time.
        #It also does seem to handle the other clients' waiting nicely. Tested with 7 simultaneous clients.
        





if __name__ == '__main__':

    model_arch=sys.argv[1]
    model_weights=sys.argv[2]
    model_norm=sys.argv[3]

    run_classifier( model_arch, model_weights, model_norm )
    
