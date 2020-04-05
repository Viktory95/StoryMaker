/**
 * Created by Vi on 04.04.2020.
 */
const electron = require('electron')
const fs = require('fs')
const path = require('path')
const $ = selector => document.querySelector(selector)
const marked = require('marked')

const dir = './temp_story_files/'

const $newStory = $('#new-story')
const $allStories = $('#all-stories')
const $newEpisode = $('#new-episode')
const $allEpisodes = $('#all-episodes')
const $newScene = $('#new-scene')
const $allScenes = $('#all-scenes')

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

var imageChoose = '';
var choiceCount = 0;

$newStory.addEventListener('click', () => {
    $storyCreation.hidden = false
    $episodeCreation.hidden = true
    $sceneCreation.hidden = true
})

$newEpisode.addEventListener('click', () => {
    if($('#choose-story option') != null) $('#choose-story option').remove() //TODO: fix
    $storyCreation.hidden = true
    $episodeCreation.hidden = false
    $sceneCreation.hidden = true
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
})

//Create Scene event
$createScene.addEventListener('click', () => {
    let storyName = $chooseStoryForScene.options[$chooseStoryForScene.selectedIndex].value
    let episodeName = $chooseEpisode.options[$chooseStoryForScene.selectedIndex].value

    let sceneText = $sceneText.value
    let textStyle = $textStyle.value
    let imageAnimation = $imageAnimation.value
    let prizeText = $prizeText.value
    let firstScene = $firstScene.checked
    let choices = document.querySelectorAll('[id^="choose-inf-"]')

    console.log(choices)

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

                        fileData.story.episodes[elNum].scenes[fileData.story.episodes.length] = sceneJson
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

        fs.writeFileSync(path.resolve(dir + storyName + '/' + storyName + '.json'), JSON.stringify(fileData), 'utf8', function () {
            console.log('Data in db were saved.')
        })
        //TODO: user inform message
    }
})

function getDirectories(srcpath) {
    return fs.readdirSync(srcpath)
            .filter(file => fs.statSync(path.join(srcpath, file)).isDirectory())
}