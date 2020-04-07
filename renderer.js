/**
 * Created by Vi on 04.04.2020.
 */
const electron = require('electron')
const fs = require('fs')
const path = require('path')
const $ = selector => document.querySelector(selector)
const marked = require('marked')
const Path = require('path');

const dir = './temp_story_files/'

const $newStory = $('#new-story')
const $allStories = $('#all-stories')
const $newEpisode = $('#new-episode')
const $allEpisodes = $('#all-episodes')
const $newScene = $('#new-scene')
const $allScenes = $('#all-scenes')

const $viewAllStories = $('#view-all-stories')
const $viewAllEpisodes = $('#view-all-episodes')
const $viewAllScenes = $('#view-all-scenes')

const $storyCreation = $('#story-creation')
const $episodeCreation = $('#episode-creation')
const $sceneCreation = $('#scene-creation')

const $storyName = $('#story-name')
const $createStory = $('#create-story')

const $episodeName = $('#episode-name')
const $chooseStory = $('#choose-story')
const $createEpisode = $('#create-episode')

const $chooseStoryForScene = $('#choose-story-for-scene')
const $chooseEpisode = $('#choose-episode')
const $imageChoose = $('#image-choose')
const $sceneText = $('#scene-text')
const $textStyle = $('#text-style')
const $imageAnimation = $('#image-animation')
const $choices = $('#choices')
const $addChoice = $('#add-choice')
const $prizeText = $('#prize-text')
const $firstScene = $('#first-scene')
const $preview = $('#preview')
const $createScene = $('#create-scene')

var imageChoose = ''
var imagePath = ''
var choiceCount = 0

$newStory.addEventListener('click', () => {
    $storyCreation.hidden = false
    $episodeCreation.hidden = true
    $sceneCreation.hidden = true
    $viewAllStories.hidden = true
    $viewAllEpisodes.hidden = true
    $viewAllScenes.hidden = true
})

$allStories.addEventListener('click', () => {
    if($('#story-table')) $('#story-table').remove()
    $storyCreation.hidden = true
    $episodeCreation.hidden = true
    $sceneCreation.hidden = true
    $viewAllStories.hidden = false
    $viewAllEpisodes.hidden = true
    $viewAllScenes.hidden = true

    let table = document.createElement('table')
    table.className = 'table'
    table.id = 'story-table'

    let thead = document.createElement('thead')

    let tr = document.createElement('tr')

    let thName = document.createElement('th')
    thName.scope = 'col'
    thName.innerText = 'Name'

    let thActions = document.createElement('th')
    thActions.scope = 'col'
    thActions.innerText = 'Actions'

    tr.appendChild(thName)
    tr.appendChild(thActions)
    thead.appendChild(tr)
    table.appendChild(thead)

    let tbody = document.createElement('tbody')

    let stories = getDirectories(path.resolve(dir))
    for(let storyNum = 0; storyNum < stories.length; storyNum++) {
        let storyName = stories[storyNum]
        let tr = document.createElement('tr')
        tr.id = 'story-tr-' + storyNum

        let tdName = document.createElement('td')
        tdName.id = 'story-' + storyNum

        let inputName = document.createElement('input')
        inputName.id = 'input-story-' + storyNum
        inputName.value = storyName
        inputName.type = 'text'
        inputName.className = 'form-con00trol'

        let tdActions = document.createElement('td')
        tdActions.id = 'story-actions-' + storyNum

        let buttonEdit = document.createElement('button')
        buttonEdit.className = 'btn btn-dark'
        buttonEdit.type = 'button'
        buttonEdit.innerText = 'Edit'
        buttonEdit.id = 'story-edit-' + storyNum
        buttonEdit.storyName = storyName
        buttonEdit.storyId = storyNum

        let buttonDelete = document.createElement('button')
        buttonDelete.className = 'btn btn-dark'
        buttonDelete.type = 'button'
        buttonDelete.innerText = 'Delete'
        buttonDelete.id = 'story-delete-' + storyNum
        buttonDelete.storyName = storyName
        buttonDelete.storyId = storyNum

        buttonEdit.addEventListener('click', (e) => {
            let storyName = e.target.storyName
            let storyId = e.target.storyId
            let newStoryName = $('#input-story-' + storyId).value
            let fileData = require('./' + dir + storyName + '/' + storyName + '.json')
            fileData.story.name = newStoryName
            fs.writeFileSync(path.resolve(dir + storyName + '/' + storyName + '.json'), JSON.stringify(fileData), 'utf8', function () {
                console.log('Data in db were saved.')
            })
            fs.renameSync(path.resolve(dir + storyName + '/' + storyName + '.json'), path.resolve(dir + storyName + '/' + newStoryName + '.json'))
            fs.renameSync(path.resolve(dir + storyName), path.resolve(dir + newStoryName))
            e.target.storyName = newStoryName
        })

        buttonDelete.addEventListener('click', (e) => {
            let storyName = e.target.storyName
            const deleteFolderRecursive = function (path) {
                if (fs.existsSync(path)) {
                    fs.readdirSync(path).forEach((file, index) => {
                        const curPath = Path.join(path, file)
                    if (fs.lstatSync(curPath).isDirectory()) {
                        deleteFolderRecursive(curPath)
                    } else {
                        fs.unlinkSync(curPath)
                    }
                })
                    fs.rmdirSync(path)
                }
            }
            deleteFolderRecursive(path.resolve(dir + storyName))
            $('#story-tr-' + e.target.storyId).remove()
        })

        tdName.appendChild(inputName)
        tdActions.appendChild(buttonEdit)
        tdActions.appendChild(buttonDelete)
        tr.appendChild(tdName)
        tr.appendChild(tdActions)
        tbody.appendChild(tr)
    }

    table.appendChild(tbody)

    $viewAllStories.append(table)
})

$allEpisodes.addEventListener('click', () => {
    if($('#episode-table')) $('#episode-table').remove()
    $storyCreation.hidden = true
    $episodeCreation.hidden = true
    $sceneCreation.hidden = true
    $viewAllStories.hidden = true
    $viewAllEpisodes.hidden = false
    $viewAllScenes.hidden = true

    let table = document.createElement('table')
    table.className = 'table'
    table.id = 'episode-table'

    let thead = document.createElement('thead')

    let tr = document.createElement('tr')

    let thName = document.createElement('th')
    thName.scope = 'col'
    thName.innerText = 'Name'

    let thActions = document.createElement('th')
    thActions.scope = 'col'
    thActions.innerText = 'Actions'

    tr.appendChild(thName)
    tr.appendChild(thActions)
    thead.appendChild(tr)
    table.appendChild(thead)

    let tbody = document.createElement('tbody')

    let stories = getDirectories(path.resolve(dir))
    for(let storyNum = 0; storyNum < stories.length; storyNum++) {
        let storyName = stories[storyNum]
        let fileData = require('./' + dir + storyName + '/' + storyName + '.json')
        if(fileData.story.episodes) {
            for (let elNum = 0; elNum < fileData.story.episodes.length; elNum++) {

                let episodeId = fileData.story.episodes[elNum].id
                let episodeName = fileData.story.episodes[elNum].name
                let tr = document.createElement('tr')

                let tdName = document.createElement('td')
                tdName.id = 'episode-' + episodeId
                tdName.innerText = episodeName

                let tdActions = document.createElement('td')
                tdActions.id = 'episode-actions-' + episodeId

                let buttonEdit = document.createElement('button')
                buttonEdit.className = 'btn btn-dark'
                buttonEdit.type = 'button'
                buttonEdit.innerText = 'Edit'
                buttonEdit.id = 'episode-edit-' + episodeId
                buttonEdit.story = storyName

                let buttonDelete = document.createElement('button')
                buttonDelete.className = 'btn btn-dark'
                buttonDelete.type = 'button'
                buttonDelete.innerText = 'Delete'
                buttonDelete.id = 'episode-delete-' + episodeId
                buttonDelete.story = storyName

                tdActions.appendChild(buttonEdit)
                tdActions.appendChild(buttonDelete)
                tr.appendChild(tdName)
                tr.appendChild(tdActions)
                tbody.appendChild(tr)
            }
        }
    }

    table.appendChild(tbody)

    $viewAllEpisodes.append(table)
})

$newEpisode.addEventListener('click', () => {
    if($('#choose-story option') != null) $('#choose-story option').remove() //TODO: fix
    $storyCreation.hidden = true
    $episodeCreation.hidden = false
    $sceneCreation.hidden = true
    $viewAllStories.hidden = true
    $viewAllEpisodes.hidden = true
    $viewAllScenes.hidden = true
    let stories = getDirectories(path.resolve(dir))
    for(let storyNum = 0; storyNum < stories.length; storyNum++) {
        let option = document.createElement("option")
        option.text = stories[storyNum]
        $chooseStory.append(option)
    }
})

$newScene.addEventListener('click', () => {
    choiceCount = 0;
    $storyCreation.hidden = true
    $episodeCreation.hidden = true
    $sceneCreation.hidden = false
    $viewAllStories.hidden = true
    $viewAllEpisodes.hidden = true
    $viewAllScenes.hidden = true

    if($('#choose-story-for-scene option') != null) $('#choose-story-for-scene option').remove() //TODO: fix
    let stories = getDirectories(path.resolve(dir))
    for(let storyNum = 0; storyNum < stories.length; storyNum++) {
        let option = document.createElement("option")
        option.text = stories[storyNum]
        $chooseStoryForScene.append(option)
    }

    let storyName = $chooseStoryForScene.options[$chooseStoryForScene.selectedIndex].value
    let fileData = require('./' + dir + storyName + '/' + storyName + '.json')
    if(fileData.story.episodes) {
        for (let elNum = 0; elNum < fileData.story.episodes.length; elNum++) {
            let option = document.createElement("option")
            option.id = fileData.story.episodes[elNum].id
            option.text = fileData.story.episodes[elNum].name
            $chooseEpisode.append(option)
        }
    }
})

//Create Story event
$createStory.addEventListener('click', () => {
    let storyName = $storyName.value
    if (!fs.existsSync(path.resolve(dir + storyName))){
        let fileData = {story: {name: storyName}}
        fs.mkdirSync(path.resolve(dir + storyName))
        fs.writeFileSync(path.resolve(dir + storyName + '/' + storyName + '.json'), JSON.stringify(fileData), 'utf8', function () {
            console.log('Data in db were saved.')
        })
        $storyName.value = ''
    //TODO: user inform message
    }
})

//Create Episode event
$createEpisode.addEventListener('click', () => {
    let storyName = $chooseStory.options[$chooseStory.selectedIndex].value
    let episodeName = $episodeName.value

    if (fs.existsSync(path.resolve(dir + storyName + '/' + storyName + '.json'))){
        let fileData = require('./' + dir + storyName + '/' + storyName + '.json')

        if(!fileData.story.episodes) {
            fileData.story.episodes = [{id: 1, name: episodeName}]
        } else {
            let id = 0
            for (let elNum = 0; elNum < fileData.story.episodes.length; elNum++) {
                if (fileData.story.episodes[elNum].id > id) {
                    id = fileData.story.episodes[elNum].id
                }
            }
            fileData.story.episodes[fileData.story.episodes.length] = {id: id + 1, name: episodeName}
        }

        fs.writeFileSync(path.resolve(dir + storyName + '/' + storyName + '.json'), JSON.stringify(fileData), 'utf8', function () {
            console.log('Data in db were saved.')
        })
        episodeName.value = ''
    //TODO: user inform message
    }
})

//Add choice event
$addChoice.addEventListener('click', () => {
    choiceCount++
    let formRow = document.createElement("div")
    formRow.className = 'form-row'
    formRow.id = 'choose-inf-' + choiceCount
    formRow.choiceId = choiceCount

    let col1 = document.createElement("div")
    col1.className = 'col'

    let col2 = document.createElement("div")
    col2.className = 'col'

    let col3 = document.createElement("div")
    col3.className = 'col'

    let inputNum = document.createElement("input")
    inputNum.id = 'choice-num-' + choiceCount
    inputNum.type = 'text'
    inputNum.className = 'form-control'
    inputNum.value = choiceCount
    inputNum.placeholder = 'Number'
    inputNum.choiceId = choiceCount

    let inputText = document.createElement("input")
    inputText.id = 'choice-text-' + choiceCount
    inputText.type = 'text'
    inputText.className = 'form-control'
    inputText.placeholder = 'Text'
    inputText.choiceId = choiceCount

    let deleteBtn = document.createElement("button")
    deleteBtn.id = 'choice-delete-' + choiceCount
    deleteBtn.type = 'button'
    deleteBtn.className = 'btn btn-dark'
    deleteBtn.innerText = 'Del'
    deleteBtn.choiceId = choiceCount

    col1.appendChild(inputNum)
    col2.appendChild(inputText)
    col3.appendChild(deleteBtn)

    formRow.appendChild(col1)
    formRow.appendChild(col2)
    formRow.appendChild(col3)

    $choices.append(formRow)

    $('#choice-delete-' + choiceCount).addEventListener('click', (e) => {
        $('#choose-inf-' + e.target.choiceId).remove()
    })
})

$chooseStoryForScene.addEventListener('change', () => {
    if($('#choose-episode option') != null) $('#choose-episode option').remove() //TODO: fix
    let storyName = $chooseStoryForScene.options[$chooseStoryForScene.selectedIndex].value
    let fileData = require('./' + dir + storyName + '/' + storyName + '.json')
    if(fileData.story.episodes) {
        for (let elNum = 0; elNum < fileData.story.episodes.length; elNum++) {
            let option = document.createElement("option")
            option.id = fileData.story.episodes[elNum].id
            option.text = fileData.story.episodes[elNum].name
            $chooseEpisode.append(option)
        }
    }
})

$('input[type="file"]').addEventListener('change', (e) => {
    imageChoose = e.target.files[0].name
    imagePath = e.target.files[0].path
})

//Create Scene event
$createScene.addEventListener('click', () => {
    let storyName = $chooseStoryForScene.options[$chooseStoryForScene.selectedIndex].value
    let episodeName = $chooseEpisode.options[$chooseEpisode.selectedIndex].value

    let sceneText = $sceneText.value
    let textStyle = $textStyle.options[$textStyle.selectedIndex].value
    let imageAnimation = $imageAnimation.options[$imageAnimation.selectedIndex].value
    let prizeText = $prizeText.value
    let firstScene = $firstScene.checked
    let choices = document.querySelectorAll('[id^="choose-inf-"]')

    if (fs.existsSync(path.resolve(dir + storyName + '/' + storyName + '.json'))){
        let fileData = require('./' + dir + storyName + '/' + storyName + '.json')

        if(fileData.story.episodes) {
            for (let elNum = 0; elNum < fileData.story.episodes.length; elNum++) {
                if (fileData.story.episodes[elNum].name === episodeName) {
                    if(fileData.story.episodes[elNum].scenes) {
                        let id = 0
                        for(let sceneNum = 0; sceneNum < fileData.story.episodes[elNum].scenes.length; sceneNum++){
                            if(id < fileData.story.episodes[elNum].scenes[sceneNum].id) {
                                id = fileData.story.episodes[elNum].scenes[sceneNum].id
                            }
                        }
                        let sceneJson = {id: id + 1,
                            isStart: firstScene,
                            name: 'scene ' + id,
                            image: imageChoose,
                            text: sceneText,
                            textPosition: textStyle,
                            animation: imageAnimation,
                            prize: prizeText}

                        for (let choice of choices) {
                            let choiceNum = $('#choice-num-' + choice.choiceId).value
                            let choiceText = $('#choice-text-' + choice.choiceId).value
                            if(sceneJson.choices) {
                                sceneJson.choices[sceneJson.choices.length] = {id: choiceNum, text: choiceText}
                            } else {
                                sceneJson.choices = [{id: choiceNum, text: choiceText}]
                            }
                        }

                        if(choices.length == 0) {
                            sceneJson.choices = [{id: 0, text: 'default'}]
                        }

                        fileData.story.episodes[elNum].scenes[fileData.story.episodes[elNum].scenes.length] = sceneJson
                    } else {
                        let sceneJson = [{id: 1,
                            isStart: firstScene,
                            name: 'scene ' + 1,
                            image: imageChoose,
                            text: sceneText,
                            textPosition: textStyle,
                            animation: imageAnimation,
                            prize: prizeText}]

                        for (let choice of choices) {
                            let choiceNum = $('#choice-num-' + choice.choiceId).value
                            let choiceText = $('#choice-text-' + choice.choiceId).value
                            if(sceneJson[0].choices) {
                                sceneJson[0].choices[sceneJson[0].choices.length] = {id: choiceNum, text: choiceText}
                            } else {
                                sceneJson[0].choices = [{id: choiceNum, text: choiceText}]
                            }
                        }

                        if(choices.length == 0) {
                            sceneJson[0].choices = [{id: 0, text: 'default'}]
                        }

                        fileData.story.episodes[elNum].scenes = sceneJson
                    }
                    break
                }
            }
        }

        fs.copyFile(imagePath, path.resolve(dir + storyName + '/' + imageChoose), (err) => {
            if (err) throw err;
            console.log(imageChoose + ' was copied.');
        });

        fs.writeFileSync(path.resolve(dir + storyName + '/' + storyName + '.json'), JSON.stringify(fileData), 'utf8', function () {
            console.log('Data in db were saved.')
        })
        imagePath = ''
        imageChoose = ''
        //TODO: user inform message
    }
})

function getDirectories(srcpath) {
    return fs.readdirSync(srcpath)
            .filter(file => fs.statSync(path.join(srcpath, file)).isDirectory())
}