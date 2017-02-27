#!/usr/bin/python

import socket
import sys

from classify_server_conf import HOST, PORT, terminator, datasplit, donemsg


if __name__ == '__main__':

    #result_dir = sys.argv[1]
    #pickle_files = sys.argv[2:]
    data_to_send = sys.argv[1:]
    msg_to_send = datasplit.join(data_to_send) + terminator
    msglen = len(msg_to_send)

    clientsocket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    clientsocket.connect((HOST, PORT))
    totalsent = 0
    while totalsent < msglen:
        print("Sending resultdir and picklelocation")
        sent = clientsocket.send(msg_to_send[totalsent:].encode('utf-8'))
        if sent == 0:
            print("Error: socket closed")
            break
        totalsent += sent

    clientsocket.recv(2048) #will block until done
    print("classification done")
