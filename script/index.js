const createElements=(arr)=>{
    const htmlElements=arr.map(el=>`<span class="btn">${el}</span>`)
    return htmlElements.join(" ");
}

const manageSpinner=(status)=>{
    if(status==true) {
        document.getElementById("spinner").classList.remove("hidden");
        document.getElementById("word-container").classList.add("hidden")
    } else {
        document.getElementById("spinner").classList.add("hidden");
        document.getElementById("word-container").classList.remove("hidden")
    }
}

const loadLessons=()=>{
fetch("https://openapi.programming-hero.com/api/levels/all")
.then(res=>res.json())
.then(data=>displayLesson(data.data));
}

const loadLevelWord=(id)=>{
    manageSpinner(true)
    const url=`https://openapi.programming-hero.com/api/level/${id}`;
    fetch(url)
    .then(res=>res.json())
    .then(data=>
        {
            const clickBtn=document.getElementById(`lesson-btn-${id}`)
            removeActive();
            clickBtn.classList.add("active");
            displayLevelWord(data.data)
        
})

}

const loadWordDetail=async(id) =>{
    const url=`https://openapi.programming-hero.com/api/word/${id}`;
    const res=await fetch(url);
    const details=await res.json();
    displayWordDetails(details.data);
}

const displayWordDetails=(word)=>{
const detailsBox=document.getElementById("details-conatiner");
detailsBox.innerHTML=`

 <div>
            <h2 class="text-2xl font-bold">
               ${word.word} (<i class="fa-solid fa-microphone-lines"></i> :${word.pronunciation}) 
            </h2>
        </div>

        <div>
            <h2 class=" font-bold">
               Meaning
            </h2>
            <p>
                ${word.meaning}
            </p>
        </div>

        <div>
            <h2 class="text-2xl font-bold">
               Example
            </h2>
            <p>
                ${word.sentence}
            </p>
        </div>

        <div>
            <h2 class="font-bold">
                Synonym
            </h2>

            <div>
           ${createElements(word.synonyms)}
        </div>
        </div>

`;

document.getElementById("my_modal_5").showModal();
}

function removeActive() {
    const lessonButtons=document.querySelectorAll(".lesson-btn");
    lessonButtons.forEach(x=>x.classList.remove("active"));
}

const displayLevelWord=(words)=>{
const wordContainer=document.getElementById("word-container");
wordContainer.innerHTML="";

if(words.length==0) {
     wordContainer.innerHTML=`
      <div class="col-span-full text-center rounded-xl py-10 space-y-6">

      <img class="mx-auto" src="./assets/alert-error.png">
        <p class="text-xl font-medium text-gray-400">Lessons havent been added yet</p>

        <h2 class="font-bold text-4xl bangla-font">go to next lesson</h2>
       </div>
    `;
    manageSpinner(false)
   return;
}


words.forEach((word) => {
    const card=document.createElement("div");
    card.innerHTML=`
     <div class="bg-white rounded-xl shadow-sm text-center py-10 px-5 space-y-4">
            <h2 class="font-bold  text-xl">${word.word? word.word:"Couldnt find word"}</h2>
            <p class="font-semibold">Meaning/pronunciation</p>
            <div class="font-bangla text-2xl font-medium">${word.meaning?word.meaning:"Couldnt find meaning"} / ${word.pronunciation?word.pronunciation:"Couldnt find pronunciation"}</div>
            <div class="flex justify-between items-center">
                <button onclick="loadWordDetail(${word.id})" class="btn bg-[#1A91FF10] hover:bg-[#1A91FF80]"><i class="fa-solid fa-circle-info"></i></button>
                <button class="btn bg-[#1A91FF10] hover:bg-[#1A91FF80]"><i class="fa-solid fa-volume-high"></i></button>
            </div>
        </div>
        
    `;
    wordContainer.appendChild(card);
    manageSpinner(false);
});
}

const displayLesson=(lessons)=>{
    const levelContainer=document.getElementById("level-container");
    levelContainer.innerHTML="";


    for(let lesson of lessons) {
        const btnDiv=document.createElement("div");
        btnDiv.innerHTML=`
        <button id="lesson-btn-${lesson.level_no}" onclick="loadLevelWord(${lesson.level_no})"  class="lesson-btn btn btn-outline btn-primary"><i class="fa-solid fa-book-open"></i> Lesson - ${lesson.level_no}</button>
        `;
        levelContainer.appendChild(btnDiv);
    } 

}
loadLessons();

document.getElementById("btn-search").addEventListener('click',()=>{
    const input=document.getElementById("input-search");
    const searchValue=input.value.trim().toLowerCase();

    fetch("https://openapi.programming-hero.com/api/words/all")
    .then(res=>res.json())
    .then(data=>{
        const allWords=data.data;
        const filterWords=allWords.filter((word)=>word.word.toLowerCase().includes(searchValue))
        displayLevelWord(filterWords);
    })
})

