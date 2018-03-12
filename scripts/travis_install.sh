#!/bin/bash

# Copyright (c) Jupyter Development Team.
# Distributed under the terms of the Modified BSD License.
set -x

# The miniconda directory may exist if it has been restored from cache
if [ -d "$MINICONDA_DIR" ] && [ -e "$MINICONDA_DIR/bin/conda" ]; then
    echo "Miniconda install already present from cache: $MINICONDA_DIR"
else # if it does not exist, we need to install miniconda
    rm -rf "$MINICONDA_DIR" # remove the directory in case we have an empty cached directory

    if [[ $GROUP == py2 ]]; then
        wget https://repo.continuum.io/miniconda/Miniconda2-latest-Linux-x86_64.sh -O ~/miniconda.sh;
    else
        wget https://repo.continuum.io/miniconda/Miniconda3-latest-Linux-x86_64.sh -O ~/miniconda.sh;
    fi

    bash ~/miniconda.sh -b -p "$MINICONDA_DIR"
    chown -R "$USER" "$MINICONDA_DIR"
    hash -r
fi

export PATH="$MINICONDA_DIR/bin:$PATH"
conda config --set always_yes yes --set changeps1 no
conda update -q conda
conda info -a # for debugging

conda remove --name test --all || true
if [[ $GROUP == py2 ]]; then
    onda create -n test -c notebook pytest python=2
else
    conda create -n test -c notebook pytest python=3
fi
source activate test

# create jupyter base dir (needed for config retrieval)
mkdir ~/.jupyter


# Install and enable the server extension
pip install -v -e ".[test]"
jlpm versions
jlpm config current
jupyter serverextension enable --py jupyterlab
