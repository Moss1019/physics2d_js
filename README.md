# physics2d_js
a simple physics simulation in 2D

## viewing the output
the code in the 'physics_own' directory has been tested on Google Chrome and Mozilla Firefox.
To run it in Safari, it needs to be transpiled first
Babel is used for transpiling the code and two build scripts are included. A shell script and a Batch script

- npm i  -> to install dependencies
- ./build.sh -> on Linux, it may be required to change the permissions to allow execution first
- build.bat -> on Windows, this script requries Windows 8 or higher to fully work

## code
The code has two versions of the physics simulation. The first one is from the book <a href="https://www.apress.com/gp/book/9781484225820">'Building a 2D Game Physics Engine'</a> and the other is a refactored version that makes use of more modern JavaScript syntax, i.e. class vs prototype
