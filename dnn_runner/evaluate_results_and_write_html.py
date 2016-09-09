#!/usr/bin/python

import sys
import numpy as np

sp=sys.argv[1]
targetfile = sys.argv[2]

result_weights = np.array([0, 0, 0.0052, 0.7513, 0, 2.0709, 0, 1.2374, 0, 0, 0.0627, 0, 0, 0, 0, 0.3476, 0, 1.4573, 0, 0, 0, 9.4770, 0.6207, 0, 0, 0.3052, 0, 0, 0, 0, 0.7215, 0, 0, 0.4643, 0, 0, 0, 0, 0, 0, 0]);

zmeanings= np.array( [  -0.1000,   -0.1000,    0.0461,    0.1728,   -0.1000,    0.1484,   -0.1000,    0.4736,   -0.1000,   -0.1000,    0.5282,   -0.1000,    0.0315,   -0.1000,    0.0059,   -0.0955,   -0.1000,   -0.0719,   -0.1000,   -0.1000,    0.1716,    0.1239,    0.0560,   -0.1000,    0.1703,    0.2989,   -0.1000,   -0.1000,   -0.1000,    0.2643,    0.7558,   -0.1000,   -0.1000,    0.2546,   -0.1000,   -0.1000,   -0.1000,   -0.1000,   -0.1000,   -0.1000,   -0.1000 ]);

zstds = np.array([1.0000, 1.0000, 0.1663, 0.2054, 1.0000, 0.1618, 1.0000, 0.1718, 1.0000, 1.0000, 0.1248, 1.0000, 0.0429, 1.0000, 0.0120, 0.0213, 1.0000, 0.0919, 1.0000, 1.0000, 0.1478, 0.0951, 0.0586, 1.0000, 0.1379, 0.1220, 1.0000, 1.0000, 1.0000, 0.1130, 0.2496, 1.0000, 1.0000, 0.1600, 1.0000, 1.0000, 1.0000, 1.0000, 1.0000, 1.0000, 1.0000 ]);

max_scores=np.array([-0.1000, -0.1000,  0.4091,  0.5417, -0.1000,  0.4091, -0.1000,  0.7333, -0.1000, -0.1000,  0.7083, -0.1000,  0.1429, -0.1000,  0.0385,       0, -0.1000,  0.3182, -0.1000, -0.1000,  0.5714,  0.3462,  0.2250, -0.1000,  0.4643,  0.5294, -0.1000, -0.1000, -0.1000,  0.4868,  0.9655, -0.1000, -0.1000 ])

min_scores=np.array([-0.1000, -0.1000, -0.1000, -0.1000, -0.1000, -0.1000, -0.1000,  0.1562, -0.1000, -0.1000,  0.2500, -0.1000,       0, -0.1000,       0, -0.1000, -0.1000, -0.1000, -0.1000, -0.1000, -0.1000,       0,       0, -0.1000, -0.1000,  0.0455, -0.1000, -0.1000, -0.1000,  0.0405,  0.1481, -0.1000, -0.1000,  0.0147, -0.1000, -0.1000, -0.1000, -0.1000, -0.1000, -0.1000, -0.1000])

ph_threshold=10

classes = { "2:":0,
            "9":1,
            "A:":2,
            "E":3,
            "E:":4,
            "I":5,
            "N":6,
            "O":7,
            "U":8,
            "Y":9,
            "a":10,
            "b":11,
            "d":12,
            "d`":13,
            "e":14,
            "e:":15,
            "f":16,
            "g":17,
            "h":18,
            "i:":19,
            "j":20,
            "k":21,
            "l":22,
            "l`":23,
            "m":24,
            "n":25,
            "n`":26,
            "o:":27,
            "p":28,
            "r":29,
            "s":30,
            "s'":31,
            "s`":32,
            "t":33,
            "t`":34,
            "u0":35,
            "u:":36,
            "v":37,
            "x\"":38,
            "y:":39,
            "}:":40 }

classnames = [ "2:", "9", "A:", "E", "E:", "I", "N", "O", "U", "Y", "a", "b", "d", "d`", "e", "e:", "f", "g", "h", "i:", "j", "k", "l", "l`", "m", "n", "n`", "o:", "p", "r", "s", "s'", "s`", "t", "t`", "u0", "u:", "v", "x\\", "y:", "}:"]

numclasses=len(zmeanings)

ph_scores=np.zeros(zmeanings.shape)

ph_counts=np.zeros(zmeanings.shape)

evaluated_ph_counts=np.zeros(zmeanings.shape)

if True:
    classfile= 'classification_data/results/'+sp+'.ref'
    guessfile= 'classification_data/results/'+sp+'.guess'

    guess=np.loadtxt(guessfile)
    ref=np.loadtxt(classfile)

    bestguess=(np.argmax(guess,1))
    
    ineffective_temp_array = guess
    
    for n in range(0,len(bestguess)):
        # print ("best guess for %i is %i" % ( n, bestguess[n])) 
        ineffective_temp_array[n,bestguess[n]]=-1

    secondbestguess=(np.argmax(ineffective_temp_array,1))
    #print ("\n%s" % re.sub('.pickle.guess', '', os.path.basename(guessfile))),

    

    for n in range(0,numclasses):
        n_indexes=np.where(ref==n)[0]
        samplecount=len( n_indexes)
        ph_counts[n] = samplecount

        if samplecount > ph_threshold:
            evaluated_ph_counts[n]=samplecount
            #print ("class %i  samples %i" % (n,samplecount))
            goodguesses = (np.where( bestguess [ n_indexes ] == n)[0])
            almostasgoodguesses=(np.where( secondbestguess [ n_indexes ] == n)[0])
            
            #print ("======")
            #print (">"+str(      (len( np.where( bestguess [ n_indexes ] == n)[0])) * 1.0 / samplecount)+"<")
            #print ("<"+str(      (len( np.where( secondbestguess [ n_indexes ] == n)[0])) * 0.5 / samplecount+">")
            ph_scores[n] = len( goodguesses) * 1.0 / samplecount \
                               + len( almostasgoodguesses) * 0.5 / samplecount 
        else:
            ph_scores[n] = -0.1 #np.nan


ph_z_scores = (ph_scores-zmeanings)

score= np.dot((ph_scores-zmeanings), result_weights)

print (score)

tf=open(targetfile,'w')




tf.write("\n\
<div id='phoneticplot' style='width:90\%;'></div>\n\
\n\
\n\
<script type='text/javascript'>\n");

tf.write("var yourscore=%.2f;\n"%score);

tf.write("\n\
\n\
var scorecolor= '#d62728'; //'#8c564b';  // chestnut brown\n\
\n\
var refspeakercolor= '#aaaaff';\n\
\n\
var predictioncolor='#2ca02c';  // cooked asparagus green\n\
\n\
var yscorelinecolor='#d62728';  // brick red\n\
\n\
// Lines are in form y = a*x + b\n\
var maina = 1.038;\n\
var mainb = 5.295;\n\
\n\
var lowera = 1.038;\n\
var lowerb = 4.645;\n\
\n\
var uppera = 1.038;\n\
var upperb = 5.946;\n\
\n\
var xlower = -8;\n\
var xupper = 8;\n\
\n\
\n\
\n\
var xtickvals=[yourscore];\n\
var xticklabs=[yourscore];\n\
for (n = -4; n < 5; n++) {\n\
  xtickvals.push(n);\n\
  console.log(n - yourscore);\n\
  if (n - yourscore > 0.25 || n - yourscore < -0.25 ) {\n\
    xticklabs.push(''+n);\n\
  }\n\
  else xticklabs.push('')\n\
}\n\
\n\
\n\
var meeting_point = maina * yourscore + mainb;\n\
var meeting_point_upper = uppera * yourscore + upperb;\n\
var meeting_point_lower = lowera * yourscore + lowerb;\n\
\n\
var xscorelinemain = {\n\
  x: [yourscore, yourscore],\n\
  y: [0, meeting_point],\n\
  mode: 'lines',\n\
  type: 'scatter',\n\
  showlegend: false, \n\
  name: 'Your computational score',\n\
  line: {\n\
    dash: 'solid',\n\
    width: 4,\n\
    color: scorecolor\n\
  }\n\
}\n\
\n\
var xscorelineupper = {\n\
  x: [yourscore, yourscore],\n\
  y: [meeting_point, meeting_point_upper],\n\
  mode: 'lines',\n\
  showlegend: false, \n\
  type: 'scatter',\n\
  line: {\n\
    dash: 'dot',\n\
    width: 2,\n\
    color: scorecolor\n\
  }\n\
}\n\
\n\
\n\
var yscorelineupper = {\n\
  x: [-5, yourscore],\n\
  y: [meeting_point_upper, meeting_point_upper],\n\
  mode: 'lines',\n\
  type: 'scatter',\n\
  showlegend: false, \n\
  line: {\n\
    dash: 'dot',\n\
    width: 2,\n\
    color: yscorelinecolor\n\
  }\n\
}\n\
var yscorelinelower = {\n\
  x: [-5, yourscore],\n\
  y: [meeting_point_lower, meeting_point_lower],\n\
  mode: 'lines',\n\
  type: 'scatter',\n\
  name: 'Your prediction confidence intervals',\n\
  line: {\n\
    dash: 'dot',\n\
    width: 2,\n\
    color: yscorelinecolor\n\
  }\n\
}\n\
var yscorelinemain = {\n\
  x: [-5, yourscore],\n\
  y: [meeting_point, meeting_point],\n\
  mode: 'lines',\n\
  type: 'scatter',\n\
  name: 'Your score and prediction',\n\
  line: {\n\
    dash: 'solid',\n\
    width: 4,\n\
    color: yscorelinecolor\n\
  }\n\
}\n\
\n\
\n\
\n\
\n\
\n\
\n\
var trace1 = {\n\
  x: [xlower, xupper],\n\
  y: [maina*xlower+mainb,  maina*xupper+mainb],\n\
  mode: 'lines',\n\
  type: 'scatter',\n\
  name: 'Fitted prediction',\n\
  line: {\n\
    dash: 'solid',\n\
    width: 2,\n\
    color: predictioncolor\n\
  }\n\
};\n\
\n\
\n\
var trace2 = {\n\
  x: [xlower, xupper],\n\
  y: [uppera*xlower+upperb,  uppera*xupper+upperb],\n\
  mode: 'lines',\n\
  type: 'scatter',\n\
  name: 'Fitting confidence bounds',\n\
  line: {\n\
    dash: 'dot',\n\
    width: 2,\n\
    color: predictioncolor\n\
  }\n\
};\n\
\n\
var trace3 = {\n\
  x: [xlower, xupper],\n\
  y: [lowera*xlower+lowerb,  lowera*xupper+lowerb],\n\
  mode: 'lines',\n\
  type: 'scatter',\n\
  showlegend: false,\n\
  line: {\n\
    dash: 'dot',\n\
    width: 2,\n\
    color: predictioncolor\n\
  }\n\
};\n\
\n\
var reference =  {\n\
   x :  [  0.5968, -0.2664,  0.9983, -1.3921, -0.2406,  1.2376,  0.9537, -0.2309,  0.6341,  0.3140,  0.5659, -1.1293, -0.5199, -0.1932, -0.5773,  2.1760, -0.6774, -0.5873,  1.3389, -1.7100, -2.2848 ],\n\
\n\
   y :  [  5.0000,  5.5000,  4.5000,  3.0000,  6.5000,  8.5000,  6.0000,  5.5000,  4.0000,  6.5000,  5.0000,  4.0000,  3.5000,  5.5000,  2.5000,  6.0000,  4.0000,  6.0000,  7.5000,  4.5000,  3.0000 ],\n\
\n\
    error_y: {\n\
      type: 'data',\n\
      symmetric: false,\n\
     arrayminus :  [  3.0000,  0.5000,  0.5000,  1.0000,  2.5000,  2.5000,  1.0000,  1.5000,  3.0000,  2.5000,  1.0000,  2.0000,  1.5000,  1.5000,  0.5000,  2.0000,  1.0000,  2.0000,  7.5000,  1.5000,       0,       ],\n\
\n\
array :  [   2.0000,  3.5000,  3.5000,  1.0000,  1.5000,  1.5000,  2.0000,  3.5000,  2.0000,  1.5000,  2.0000,  3.0000,  1.5000,  1.5000,  1.5000,  2.0000,  3.0000,  2.0000,  1.5000,  0.5000,  3.0000,       ],\n\
       color: refspeakercolor\n\
\n\
    },\n\
  mode: 'markers',\n\
  type: 'scatter',\n\
  name: 'Reference speakers',\n\
  line : {\n\
    color: refspeakercolor\n\
  },\n\
};\n\
\n\
//Plotly.newPlot('myDiv', data);\n\
\n\
\n\
var data = [reference,trace1, trace2, trace3, \n\
xscorelinemain, xscorelineupper, yscorelinemain, yscorelinelower, yscorelineupper];\n\
\n\
var layout = { \n\
   yaxis: { \n\
        title: 'Human Evaluation of Pronunciation',\n\
        tickvals:[1,2,3,4,5,6,7,8,9,10], \n\
        range: [0.8, 10.2] \n\
    },\n\
    xaxis : {\n\
        title: 'Computational Score of Phonetic Clarity',\n\
        zeroline: false,\n\
        tickvals: xtickvals, \n\
        ticktext: xticklabs,\n\
        range : [-5, 5]\n\
    }\n\
};\n\
\n\
/*xaxis: {\n\
    range: [ 0.75, 5.25 ]\n\
  },\n\
  yaxis: {\n\
    range: [0, 8]\n\
  },\n\
};*/\n\
\n\
Plotly.newPlot('phoneticplot', data, layout);\n\
</script>\n");






tf.write("<p>Your computational score is %.2f.\n" % (score))
tf.write("We detected a total %i of target %i phonetic segments,\n" % ( np.sum(ph_counts),  426))
tf.write("of which %i are used in evaluation.\n" % ( np.sum(evaluated_ph_counts))) # 328


tf.write("<h3>2. Phonetic performance phone by phone</h3>")

tf.write("<p> In comparison to average Finnish high school student. Phones use the SAMPA notation.\n");


phonetypes = [ [ "Plosives" ,[ "p", "b", "t", "d", "k", "g" ] ],
               [ "Fricatives" ,[ "f", "v", "s", "S","h", "C" ] ],
               [ "Sonorant consonants (nasals, liquids and semivowels)" ,[ "m", "n", "N", "r", "l", "j"  ] ],
               [ "Short vowels", [ "I", "e", "E", "Y","u0", "2", "U", "O", "a"  ] ],
               [ "Long vowels", [ "I:", "e:", "E:", "Y:", "u0:", "2:", "U:", "O:", "a:"  ] ],
               [ "Some important allophonic variants" ,[ "{:", "9:", "{", "9", "@", "rt", "rd", "rn", "rs", "rl" ] ] ]

phonetypes = [ [ "Plosives" ,[ "p", "b", "t", "d", "k", "g" ] ],
               [ "Fricatives" ,[ "f", "v", "s", "s'", "s`", "h", "C" ] ],
               [ "Sonorant consonants (nasals, liquids and semivowels)" ,[ "m", "n", "N", "r", "l", "j"  ] ],
               [ "Short vowels", [ "I", "e", "E", "Y","u0", "2", "U", "O", "a"  ] ],
               [ "Long vowels", [ "I:", "e:", "E:", "Y:", "}:", "u0:", "2:", "U:", "O:", "o:", "a:", "A:"  ] ],
               [ "Some important allophonic variants" ,[ "{:", "9:", "{", "9", "@", "rt", "rd", "rn", "rs", "rl" ] ] ]

    

shown_classes = []

for ptype in phonetypes:
    
    tf.write("<h4>%s:</h4>\n" % ptype[0])
    tf.write("<table>\n");
    tf.write("<tr>\n");
    tf.write("<th>%s</th>\n"% "Phone");
    tf.write("<th>%s</th>\n"% "Performance");
    tf.write("<th>%s</th>\n"% "Your samples");
    tf.write("<th>%s</th>\n"% "Native samples");


    tf.write("</tr>\n");


    for p in ptype[1]:
        if p in classnames:

            shown_classes.append(p)

            if ph_counts[ classes[p] ] > 0:

                tf.write("<tr>\n");
                tf.write("<td>%s</td>\n" % p);
                if ph_counts[ classes[p] ] > ph_threshold:
                    pscore =  ph_z_scores[ classes[p] ]
                    # Adjust by min/max:
                    if pscore > 0:
                        tf.write("<td>+%.2f</td>\n" % pscore );
                    else:
                        tf.write("<td>%.2f</td>\n" % pscore );
                else:
                    tf.write("<td>(not enough data)</td>\n");

                tf.write("<td><audio src=\"/is16/phone_samples/%s/%s.wav\" controls></td>\n" % (sp, p) );
                tf.write("<td><audio src=\"/is16/phone_samples/stig/%s.wav\" controls></td>\n" % p);

            tf.write("</tr>\n");
        else:
             print ("Discarding phone %s" % p)
    tf.write("</table>\n")

tf.close()


for p in classes.keys():
    if p not in shown_classes:
        print ("Did not use %s, num items: %i" % (p, ph_counts[ classes[p]]))
