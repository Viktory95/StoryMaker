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

const $viewStory = $('#view-story')
const $sceneImg = $('#scene-img')
const $topBox = $('#top-box')
const $bottomBox = $('#bottom-box')
const $rightBox = $('#right-box')
const $leftBox = $('#left-box')
const $centerBox = $('#center-box')

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

$allScenes.addEventListener('click', () => {
    if($('#scene-table')) $('#scene-table').remove()
    $storyCreation.hidden = true
    $episodeCreation.hidden = true
    $sceneCreation.hidden = true
    $viewAllStories.hidden = true
    $viewAllEpisodes.hidden = true
    $viewAllScenes.hidden = false

let table = document.createElement('table')
table.className = 'table'
table.id = 'scene-table'

let thead = document.createElement('thead')

let tr = document.createElement('tr')

let thName = document.createElement('th')
thName.scope = 'col'
thName.innerText = 'Name'

let thNextScene = document.createElement('th')
thNextScene.scope = 'col'
thNextScene.innerText = 'Actions'

let thActions = document.createElement('th')
thActions.scope = 'col'
thActions.innerText = 'Actions'

tr.appendChild(thName)
tr.appendChild(thNextScene)
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
            if(fileData.story.episodes[elNum].scenes) {
                for (let sceneNum = 0; sceneNum < fileData.story.episodes[elNum].scenes.length; sceneNum++) {
                    let sceneId = fileData.story.episodes[elNum].scenes[sceneNum].id
                    let sceneName = fileData.story.episodes[elNum].scenes[sceneNum].name
                    if(fileData.story.episodes[elNum].scenes[sceneNum].choices) {
                        for (let choiceNum = 0; choiceNum < fileData.story.episodes[elNum].scenes[sceneNum].choices.length; choiceNum++) {
                            let choiceId = fileData.story.episodes[elNum].scenes[sceneNum].choices[choiceNum].id
                            let choiceText = fileData.story.episodes[elNum].scenes[sceneNum].choices[choiceNum].text

                            let tr = document.createElement('tr')
                            tr.id = 'scene-tr-' + choiceId + '-' + sceneId + '-' + episodeId + '-' + storyNum

                            let tdName = document.createElement('td')
                            tdName.id = 'scene-' + choiceId + '-' + sceneId + '-' + episodeId + '-' + storyNum
                            tdName.innerText = 'Story: ' + storyName + '; Episode: ' + episodeName + '; Scene: ' + sceneName + '     '

                            let inputName = document.createElement('input')
                            inputName.id = 'input-scene-' + choiceId + '-' + sceneId + '-' + episodeId + '-' + storyNum
                            inputName.value = choiceText
                            inputName.type = 'text'
                            inputName.className = 'form-con00trol'

                            let tdNextScene = document.createElement('td')
                            tdName.id = 'td-next-scene-' + choiceId + '-' + sceneId + '-' + episodeId + '-' + storyNum

                            let selectNextScene = document.createElement('select')
                            selectNextScene.className = 'form-control'
                            selectNextScene.id = 'next-scene-' + choiceId + '-' + sceneId + '-' + episodeId + '-' + storyNum

                            let option = document.createElement('option')
                            option.innerText = 'End'
                            option.sceneId = ''
                            selectNextScene.appendChild(option)

                            for (let sceneNum2 = 0; sceneNum2 < fileData.story.episodes[elNum].scenes.length; sceneNum2++) {
                                if(fileData.story.episodes[elNum].scenes[sceneNum2].id != sceneId) {
                                    let option = document.createElement('option')
                                    option.innerText = fileData.story.episodes[elNum].scenes[sceneNum2].name
                                    option.sceneId = sceneId
                                    selectNextScene.appendChild(option)
                                }
                            }

                            tdNextScene.appendChild(selectNextScene)

                            let tdActions = document.createElement('td')
                            tdActions.id = 'scene-actions-' + choiceId + '-' + sceneId + '-' + episodeId + '-' + storyNum

                            let buttonEdit = document.createElement('button')
                            buttonEdit.className = 'btn btn-dark'
                            buttonEdit.type = 'button'
                            buttonEdit.innerText = 'Edit'
                            buttonEdit.id = 'scene-edit-' + choiceId + '-' + sceneId + '-' + episodeId + '-' + storyNum
                            buttonEdit.story = storyName
                            buttonEdit.episodeId = episodeId
                            buttonEdit.storyNum = storyNum
                            buttonEdit.sceneId = sceneId
                            buttonEdit.choiceId = choiceId

                            let buttonDelete = document.createElement('button')
                            buttonDelete.className = 'btn btn-dark'
                            buttonDelete.type = 'button'
                            buttonDelete.innerText = 'Delete'
                            buttonDelete.id = 'scene-delete-' + choiceId + '-' + sceneId + '-' + episodeId + '-' + storyNum
                            buttonDelete.story = storyName
                            buttonDelete.episodeId = episodeId
                            buttonDelete.storyNum = storyNum
                            buttonDelete.sceneId = sceneId
                            buttonDelete.choiceId = choiceId

                            buttonEdit.addEventListener('click', (e) => {
                                let storyName1 = e.target.story
                                let episodeId1 = e.target.episodeId
                                let sceneId1 = e.target.sceneId
                                let choiceId1 = e.target.choiceId
                                let fileData = require('./' + dir + storyName1 + '/' + storyName1 + '.json')
                                for (let episodeNum1 = 0; episodeNum1 < fileData.story.episodes.length; episodeNum1++) {
                                    if(fileData.story.episodes[episodeNum1].id == episodeId1
                                        && fileData.story.episodes[episodeNum1].scenes) {
                                        for (let sceneNum1 = 0; sceneNum1 < fileData.story.episodes[episodeNum1].scenes.length; sceneNum1++) {
                                            if(fileData.story.episodes[episodeNum1].scenes[sceneNum1].id == sceneId1
                                                && fileData.story.episodes[episodeNum1].scenes[sceneNum1].choices) {
                                                for (let choiceNum1 = 0; choiceNum1 < fileData.story.episodes[episodeNum1].scenes[sceneNum1].choices.length; choiceNum1++) {
                                                    if (fileData.story.episodes[episodeNum1].scenes[sceneNum1].choices[choiceNum1].id == choiceId1) {
                                                        fileData.story.episodes[episodeNum1].scenes[sceneNum1].choices[choiceNum1].text = $('#input-scene-' + choiceId1 + '-'
                                                            + sceneId1 + '-' + episodeId1 + '-' + e.target.storyNum).value

                                                        let $chooseNextScene = $('#next-scene-' +  + choiceId1 + '-'
                                                            + sceneId1 + '-' + episodeId1 + '-' + e.target.storyNum)

                                                        fileData.story.episodes[episodeNum1].scenes[sceneNum1].choices[choiceNum1].nextScene =
                                                            $chooseNextScene.options[$chooseNextScene.selectedIndex].sceneId

                                                        console.log($chooseNextScene.options[$chooseNextScene.selectedIndex].sceneId)

                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                                fs.writeFileSync(path.resolve(dir + storyName1 + '/' + storyName1 + '.json'), JSON.stringify(fileData), 'utf8', function () {
                                    console.log('Data in db were saved.')
                                })
                            })

                            buttonDelete.addEventListener('click', (e) => {
                                let storyName1 = e.target.story
                                let episodeId1 = e.target.episodeId
                                let sceneId1 = e.target.sceneId
                                let choiceId1 = e.target.choiceId
                                let sceneToDelete = false
                                let fileData = require('./' + dir + storyName1 + '/' + storyName1 + '.json')
                                for (let episodeNum1 = 0; episodeNum1 < fileData.story.episodes.length; episodeNum1++) {
                                    if(fileData.story.episodes[episodeNum1].id == episodeId1
                                        && fileData.story.episodes[episodeNum1].scenes) {
                                        for (let sceneNum1 = 0; sceneNum1 < fileData.story.episodes[episodeNum1].scenes.length; sceneNum1++) {
                                            if(fileData.story.episodes[episodeNum1].scenes[sceneNum1].id == sceneId1
                                                && fileData.story.episodes[episodeNum1].scenes[sceneNum1].choices) {

                                                if(fileData.story.episodes[episodeNum1].scenes[sceneNum1].choices.length == 1) {
                                                    sceneToDelete = true
                                                } else {
                                                    let choices = fileData.story.episodes[episodeNum1].scenes[sceneNum1].choices
                                                    fileData.story.episodes[episodeNum1].scenes[sceneNum1].choices = []
                                                    for (let choiceNum1 = 0; choiceNum1 < choices.length; choiceNum1++) {
                                                        if (choices[choiceNum1].id != choiceId1) {
                                                            fileData.story.episodes[episodeNum1].scenes[sceneNum1].choices.push(choices[choiceNum1])
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }

                                if(sceneToDelete) {
                                    for (let episodeNum1 = 0; episodeNum1 < fileData.story.episodes.length; episodeNum1++) {
                                        if(fileData.story.episodes[episodeNum1].id == episodeId1
                                            && fileData.story.episodes[episodeNum1].scenes) {
                                            let scenes = fileData.story.episodes[episodeNum1].scenes
                                            fileData.story.episodes[episodeNum1].scenes = []
                                            for (let sceneNum1 = 0; sceneNum1 < scenes.length; sceneNum1++) {
                                                if(scenes[sceneNum1].id != sceneId1) {
                                                    fileData.story.episodes[episodeNum1].scenes.push(scenes[sceneNum1])
                                                }
                                            }
                                        }
                                    }
                                }

                                fs.writeFileSync(path.resolve(dir + storyName1 + '/' + storyName1 + '.json'), JSON.stringify(fileData), 'utf8', function () {
                                    console.log('Data in db were saved.')
                                })
                                $('#scene-tr-' + choiceId1 + '-' + sceneId1 + '-' + episodeId1 + '-' + e.target.storyNum).remove()
                            })

                            tdActions.appendChild(buttonEdit)
                            tdActions.appendChild(buttonDelete)
                            tdName.appendChild(inputName)
                            tr.appendChild(tdName)
                            tr.appendChild(tdNextScene)
                            tr.appendChild(tdActions)
                            tbody.appendChild(tr)

                        }
                    }
                }
            }
            }
        }
    }

    table.appendChild(tbody)

    $viewAllScenes.append(table)

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
                tr.id = 'episode-tr-' + episodeId + '-' + storyNum

                let tdName = document.createElement('td')
                tdName.id = 'episode-' + episodeId + '-' + storyNum
                tdName.innerText = storyName + ': '

                let inputName = document.createElement('input')
                inputName.id = 'input-episode-' + episodeId + '-' + storyNum
                inputName.value = episodeName
                inputName.type = 'text'
                inputName.className = 'form-con00trol'

                let tdActions = document.createElement('td')
                tdActions.id = 'episode-actions-' + episodeId + '-' + storyNum

                let buttonEdit = document.createElement('button')
                buttonEdit.className = 'btn btn-dark'
                buttonEdit.type = 'button'
                buttonEdit.innerText = 'Edit'
                buttonEdit.id = 'episode-edit-' + episodeId + '-' + storyNum
                buttonEdit.story = storyName
                buttonEdit.episodeId = episodeId
                buttonEdit.storyNum = storyNum

                let buttonDelete = document.createElement('button')
                buttonDelete.className = 'btn btn-dark'
                buttonDelete.type = 'button'
                buttonDelete.innerText = 'Delete'
                buttonDelete.id = 'episode-delete-' + episodeId + '-' + storyNum
                buttonDelete.story = storyName
                buttonDelete.episodeId = episodeId
                buttonDelete.storyNum = storyNum

                buttonEdit.addEventListener('click', (e) => {
                    let storyName = e.target.story
                    let fileData = require('./' + dir + storyName + '/' + storyName + '.json')
                    for (let episodeNum = 0; episodeNum < fileData.story.episodes.length; episodeNum++) {
                        if (fileData.story.episodes[episodeNum].id == e.target.episodeId) {
                            fileData.story.episodes[episodeNum].name = $('#input-episode-' + e.target.episodeId + '-' + e.target.storyNum).value
                        }
                    }
                    fs.writeFileSync(path.resolve(dir + storyName + '/' + storyName + '.json'), JSON.stringify(fileData), 'utf8', function () {
                        console.log('Data in db were saved.')
                    })
                })

                buttonDelete.addEventListener('click', (e) => {
                    let storyName = e.target.story
                    let fileData = require('./' + dir + storyName + '/' + storyName + '.json')
                    let episodes = fileData.story.episodes
                    fileData.story.episodes = []
                    for (let episodeNum = 0; episodeNum < episodes.length; episodeNum++) {
                        if (episodes[episodeNum].id != e.target.episodeId) {
                            fileData.story.episodes.push(episodes[episodeNum])
                        }
                    }
                    fs.writeFileSync(path.resolve(dir + storyName + '/' + storyName + '.json'), JSON.stringify(fileData), 'utf8', function () {
                        console.log('Data in db were saved.')
                    })
                    $('#episode-tr-' + e.target.episodeId + '-' + e.target.storyNum).remove()
                })

                tdActions.appendChild(buttonEdit)
                tdActions.appendChild(buttonDelete)
                tdName.appendChild(inputName)
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

    $topBox.hidden = true
    $bottomBox.hidden = true
    $leftBox.hidden = true
    $rightBox.hidden = true
    $centerBox.hidden = true
    $topBox.innerHTML = ''
    $bottomBox.innerHTML = ''
    $leftBox.innerHTML = ''
    $rightBox.innerHTML = ''
    $centerBox.innerHTML = ''
    let textStyle = $textStyle.options[$textStyle.selectedIndex].value
    let sceneText = $sceneText.value
    switch (textStyle) {
        case 'Top':
            sceneTextView($topBox, document.querySelectorAll('[id^="choose-inf-"]'), sceneText, 'top-text')
            break
        case 'Bottom':
            sceneTextView($bottomBox, document.querySelectorAll('[id^="choose-inf-"]'), sceneText, 'bottom-text')
            break
        case 'Left':
            sceneTextView($leftBox, document.querySelectorAll('[id^="choose-inf-"]'), sceneText, 'left-text')
            break
        case 'Right':
            sceneTextView($rightBox, document.querySelectorAll('[id^="choose-inf-"]'), sceneText, 'right-text')
            break
        case 'Center':
            sceneTextView($centerBox, document.querySelectorAll('[id^="choose-inf-"]'), sceneText, 'center-text')
            break
    }
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
    fs.copyFile(imagePath, path.resolve(dir + imageChoose), (err) => {
        if (err) throw err
        console.log(imageChoose + ' was copied.')
    })
    $sceneImg.style.backgroundImage = 'url(' + dir + imageChoose + ')'
    $sceneImg.style.backgroundPosition = '0px 0px'
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

$sceneText.addEventListener('change', () => {
    $topBox.hidden = true
    $bottomBox.hidden = true
    $leftBox.hidden = true
    $rightBox.hidden = true
    $centerBox.hidden = true
    $topBox.innerHTML = ''
    $bottomBox.innerHTML = ''
    $leftBox.innerHTML = ''
    $rightBox.innerHTML = ''
    $centerBox.innerHTML = ''
    let textStyle = $textStyle.options[$textStyle.selectedIndex].value
    let sceneText = $sceneText.value
    switch (textStyle) {
        case 'Top':
            sceneTextView($topBox, document.querySelectorAll('[id^="choose-inf-"]'), sceneText, 'top-text')
            break
        case 'Bottom':
            sceneTextView($bottomBox, document.querySelectorAll('[id^="choose-inf-"]'), sceneText, 'bottom-text')
            break
        case 'Left':
            sceneTextView($leftBox, document.querySelectorAll('[id^="choose-inf-"]'), sceneText, 'left-text')
            break
        case 'Right':
            sceneTextView($rightBox, document.querySelectorAll('[id^="choose-inf-"]'), sceneText, 'right-text')
            break
        case 'Center':
            sceneTextView($centerBox, document.querySelectorAll('[id^="choose-inf-"]'), sceneText, 'center-text')
            break
    }
})

$textStyle.addEventListener('change', () => {
    $topBox.hidden = true
    $bottomBox.hidden = true
    $leftBox.hidden = true
    $rightBox.hidden = true
    $centerBox.hidden = true
    $topBox.innerHTML = ''
    $bottomBox.innerHTML = ''
    $leftBox.innerHTML = ''
    $rightBox.innerHTML = ''
    $centerBox.innerHTML = ''
    let textStyle = $textStyle.options[$textStyle.selectedIndex].value
    let sceneText = $sceneText.value
    switch (textStyle) {
        case 'Top':
            sceneTextView($topBox, document.querySelectorAll('[id^="choose-inf-"]'), sceneText, 'top-text')
            break
        case 'Bottom':
            sceneTextView($bottomBox, document.querySelectorAll('[id^="choose-inf-"]'), sceneText, 'bottom-text')
            break
        case 'Left':
            sceneTextView($leftBox, document.querySelectorAll('[id^="choose-inf-"]'), sceneText, 'left-text')
            break
        case 'Right':
            sceneTextView($rightBox, document.querySelectorAll('[id^="choose-inf-"]'), sceneText, 'right-text')
            break
        case 'Center':
            sceneTextView($centerBox, document.querySelectorAll('[id^="choose-inf-"]'), sceneText, 'center-text')
            break
    }
})

$imageAnimation.addEventListener('change', () => {
    imgMovement($imageAnimation.options[$imageAnimation.selectedIndex].value)
})

function sceneTextView($box, choices, text, elId) {
    let $topText = document.createElement('div')
    $topText.id = elId
    $topText.innerText = text
    $box.append($topText)
    let choiceNum = 0
    if(choices.length > 0) {
        for (let choice of choices) {
            let choiceText = $('#choice-text-' + choice.choiceId).value
            let div = document.createElement('div')
            div.innerText = (choiceNum + 1) + ')' + choiceText
            $box.append(div)
            choiceNum++
        }
    }
    $box.hidden = false
}

function imgMovement(side) {
    let elem = $('#scene-img')
    let pos = -50
    let timer
    switch (side) {
        case 'Move to the bottom':
            elem.style.backgroundSize = '500px 700px'
            elem.style.backgroundPosition = '0px ' + pos + 'px'
            timer = setInterval(function() {
                pos++;
                elem.style.backgroundPosition = '0px ' + pos + 'px'
                if( pos == 0) clearInterval(timer)
            }, 25)
            break
        case 'Move to the top':
            pos = 0
            elem.style.backgroundSize = '500px 700px'
            elem.style.backgroundPosition = '0px ' + pos + 'px'
            timer = setInterval(function() {
                pos--;
                elem.style.backgroundPosition = '0px ' + pos + 'px'
                if( pos == -50) clearInterval(timer)
            }, 25)
            break
        case 'Move to the right':
            elem.style.backgroundSize = '550px 600px'
            elem.style.backgroundPosition = pos + 'px 0px'
            timer = setInterval(function() {
                pos++;
                elem.style.backgroundPosition =  pos + 'px 0px'
                if( pos == 0) clearInterval(timer)
            }, 25)
            break
        case 'Move to the left':
            pos = 0
            elem.style.backgroundSize = '550px 600px'
            elem.style.backgroundPosition = pos + 'px 0px'
            timer = setInterval(function() {
                pos--;
                elem.style.backgroundPosition =  pos + 'px 0px'
                if( pos == -50) clearInterval(timer)
            }, 25)
            break
    }
}