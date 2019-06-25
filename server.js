var express = require('express')
var app = express()
var fetch = require('isomorphic-fetch')
require('dotenv').config();

const FigmaAPIKey = "15397-215cd3d1-8cb8-4e59-a90e-43f2da257516"
//const FigmaFileID = "UKRkeh3a3SVyxz87lyRk99" //FarmX
const FigmaFileID = "Bg93Xzx3l8K78DsRjRCvZZjk" //testing

async function figmaFileFetch(fileId) {
    let result = await fetch('https://api.figma.com/v1/files/' + fileId, {
        method: 'GET',
        headers: {
            'X-Figma-Token': FigmaAPIKey
        }
    })

    let figmaFileStruct = await result.json()
    let figmaFrames = figmaFileStruct.document.children
        .filter(child => child.type === 'CANVAS')[0].children
        .filter(child => child.type === 'FRAME')[1].children

        .map(frame => {
            return {
                name: frame.name,
                id: frame.id,
                type: frame.type
            }
        })

    let ids = figmaFrames.map(comp => comp.id).join(',')
    console.log(figmaFrames);

    let imageResult = await fetch('https://api.figma.com/v1/images/' + fileId + '?scale=2&ids=' + ids, {
        method: 'GET',
        headers: {
            'X-Figma-Token': FigmaAPIKey
        }
    }).catch(error => console.log(error))

    let figmaImages = await imageResult.json()

    figmaImages = figmaImages.images


    return figmaFrames.map(frame => {
        return {
            name: frame.name,
            url: figmaImages[frame.id],
            type: frame.type
        }
    })
}


app.use('/frames', async function (req, res, next) {
    let result = await figmaFileFetch(FigmaFileID).catch(error => console.log(error))
    res.send(result)
})

app.listen(3001, console.log("Listening on port 3001"))
