import { Home } from "~~/server/models/home-model";
import { About } from "~~/server/models/about-model";
import { OurPlace } from "~~/server/models/our-place-model";
import { Retreat } from "~~/server/models/retreat-model";
import { Team } from "~~/server/models/team-model";
import { Surfing } from "~~/server/models/surfing-model";
import { Sustainability } from "~~/server/models/sustainability-model";
import { GivingBack } from "~~/server/models/giving-back-model";
import { Policies } from "~~/server/models/policies-model";
import { JournalPost } from "~~/server/models/journal-post-model";
import { HelpCenter } from "~~/server/models/help-center-model";
import { Menu } from "~~/server/models/menu-model";
import { Testimonials } from "~~/server/models/testimonials-model";



const model = {
    'home': async () => await Home.findById('home'),
    'about': async () => await About.findById('about'),
    'our-place': async () => await OurPlace.findById('our-place'),
    'retreats': async (id) => await Retreat.findById(id),
    'surfing': async () => await Surfing.findById('surfing'),
    'team': async () => await Team.findById('team'),
    'journal': async (id) => {
        if (id) {
            return await JournalPost.findOne({id: id})
        } else {
            return await JournalPost.find().sort({_id: -1})   
        }
    },
    'sustainability': async () => await Sustainability.findById('sustainability'),
    'giving-back': async () => await GivingBack.findById('giving-back'),  
    'policies': async () => await Policies.findById('policies'),  
    'help-center': async () => await HelpCenter.findById('help-center'),
    'menu': async () => await Menu.findById('menu'),
    'testimonials': async () => await Testimonials.findById('testimonials')
}


class AdminService {

    async get(route, id) {
        console.log('AdminService get ', route, id)
        try {
            const document = await model[route](id)
            //console.log('document ', document)
            return document;
        } catch (e) {
            return {
                success: false,
                message: e.message
            }
        }
    }

    async update (route, id, lang, body) {
        console.log('AdminService update ', route, id, lang)
        try {
            const document = await model[route](id);
            console.log('AdminService update document', document)
            if (!document) return  {
                success: false,
                message: "Document not found"
            };
            if (route !== 'journal') {
                document.translations[lang] = body;
            } else {
                //document = body;
            }
            const saveDoc = await document.save();

            return {
                success: true,
                message: 'Document successfully saved!',
                data: saveDoc
            }
        } catch (e) {
            return {
                success: false,
                message: e.message
            }
        }
    }
 
}

export default new AdminService();