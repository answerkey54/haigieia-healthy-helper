import {*} with "bi_enc.jac";
import {*} with "tfm_ner.jac";
node cai_state {
    has name;
    can init_wlk_ctx {
        new_wlk_ctx = {
            "intent": null,
            "entities": {},
            "prev_state": null,
            "next_state": null,
            "respond": false
        };
        if ("entities" in visitor.wlk_ctx) {
            // Carry over extracted entities from previous interaction
            new_wlk_ctx["entities"] = visitor.wlk_ctx["entities"];
        }
        visitor.wlk_ctx = new_wlk_ctx;
    }
    can nlu {}
    can process {
        if (visitor.wlk_ctx["prev_state"]): visitor.wlk_ctx["respond"] = true;
        else {
            visitor.wlk_ctx["next_state"] = net.root();
            visitor.wlk_ctx["prev_state"] = here;
        }
    }
    can nlg {}
}

node dialogue_state:cai_state {
    can bi_enc.infer;
    can tfm_ner.extract_entity;

    can classify_intent {
        intent_labels = -[intent_transition]->.edge.intent;
        visitor.wlk_ctx["intent"] = bi_enc.infer(
            contexts = [visitor.question],
            candidates = intent_labels,
            context_type = "text",
            candidate_type = "text"
        )[0]["predicted"]["label"];
    }

    can extract_entities {
        res = tfm_ner.extract_entity(visitor.question);
        for ent in res {
            ent_type = ent["entity_value"];
            ent_text = ent["entity_text"];
            if (!(ent_type in visitor.wlk_ctx["entities"])){
                visitor.wlk_ctx["entities"][ent_type] = [];
            }
            visitor.wlk_ctx["entities"][ent_type].l::append(ent_text);
        }
    }

    can nlu {}
    can nlg {}
}

node dialogue_root:dialogue_state {
    has name = "dialogue_root";
    can nlu {
        ::classify_intent;
    }
    can process {
        visitor.wlk_ctx["respond"] = true;
        if (visitor.wlk_ctx["prev_state"].context["name"] == "confirmation") {
            visitor.wlk_ctx["entities"] = {}
        }
        visitor.wlk_ctx["next_state"] = (-[intent_transition(intent==visitor.wlk_ctx["intent"])]->)[0];
    }
    can nlg {
        if (visitor.wlk_ctx["prev_state"].context["name"] == "confirmation") {
            visitor.response = "Sorry I got your meal wrong. Starting over from the beginning... \n \n Hi! How can I help you be healthy today?";
        } else {
            visitor.response = "Hi! How can I help you be healthy today?";
        }
    }
}

node record_food:dialogue_state {
    has name = "record_food";
    can nlu {
        if (!visitor.wlk_ctx["intent"]): ::classify_intent;
        ::extract_entities;
    }
    can process {
        required_entities = -[entity_transition]->.edge[0].context["entities"];
        // Check if we have both food and quantity entities
        if (vector.sort_by_key(visitor.wlk_ctx["entities"].d::keys) == vector.sort_by_key(required_entities)) {
            visitor.recorded_food = true;
            visitor.wlk_ctx["next_state"] = -[entity_transition]->[0];
            visitor.wlk_ctx["prev_state"] = here;
        } else {
            visitor.wlk_ctx["respond"] = true;
            visitor.wlk_ctx["next_state"] = here;
        }
    }
    can nlg {
        if ("food" in visitor.wlk_ctx["entities"] and "quantity_f" not in visitor.wlk_ctx["entities"]):
            visitor.response = "How much " + visitor.wlk_ctx["entities"]["food"][0] + " did you eat?";
        elif ("quantity_f" in visitor.wlk_ctx["entities"] and "food" not in visitor.wlk_ctx["entities"]):
            visitor.response = "You ate " + visitor.wlk_ctx["entities"]["quantity_f"][0] + " of what food again?";
        else:
            visitor.response = "What did you eat today?"; 
    }
}

node record_drink:dialogue_state {
    has name = "record_drink";
    can nlu {
        if (!visitor.wlk_ctx["intent"]): ::classify_intent;
        ::extract_entities;
    }
    can process {
        required_entities = -[entity_transition]->.edge[0].context["entities"];
        // Check if we have both drink and quantity entities
        if (vector.sort_by_key(visitor.wlk_ctx["entities"].d::keys) == vector.sort_by_key(required_entities)) {
            visitor.recorded_drink = true;
            visitor.wlk_ctx["next_state"] = -[entity_transition]->[0];
            visitor.wlk_ctx["prev_state"] = here;
        } else {
            visitor.wlk_ctx["respond"] = true;
            visitor.wlk_ctx["next_state"] = here;
        }
    }
    can nlg {
        if ("drink" in visitor.wlk_ctx["entities"] and "quantity_d" not in visitor.wlk_ctx["entities"]):
            visitor.response = "How much " + visitor.wlk_ctx["entities"]["drink"][0] + " did you drink?";
        elif ("quantity_d" in visitor.wlk_ctx["entities"] and "drink" not in visitor.wlk_ctx["entities"]):
            visitor.response = "You drank " + visitor.wlk_ctx["entities"]["quantity_d"][0] + " of what again?";
        else:
            visitor.response = "What did you drink today?";
    }
}

node follow_up:dialogue_state {
    has name = "follow_up";
    can nlu {
        ::classify_intent;
    }
    can process {
        if (visitor.wlk_ctx["prev_state"]): visitor.wlk_ctx["respond"] = true;
        visitor.wlk_ctx["next_state"] = (-[intent_transition(intent==visitor.wlk_ctx["intent"])]->)[0];
        visitor.wlk_ctx["prev_state"] = here;
    }
    can nlg {
        if (visitor.recorded_drink and !visitor.recorded_food) : visitor.response = "Thank you! Did you have anything to eat you'd like to report?";
        elif (!visitor.recorded_drink and visitor.recorded_food) : visitor.response = "Thank you! Did you have anything to drink you'd like to report?";
        else {
            visitor.response = "Thank you! Do you have anything else you'd like to record?";
        }
    }
}

node confirmation:dialogue_state {
    has name = "confirmation";
    can nlu {
        ::classify_intent;
    }
    can process {
        if (visitor.wlk_ctx["prev_state"]): visitor.wlk_ctx["respond"] = true;
        visitor.wlk_ctx["next_state"] = (-[intent_transition(intent==visitor.wlk_ctx["intent"])]->)[0];
        visitor.wlk_ctx["prev_state"] = here;
    }
    can nlg {
        meal_string = "";
        for i = 0 to i < visitor.wlk_ctx["entities"]["quantity_f"].length by i+=1 {
            meal_string += visitor.wlk_ctx["entities"]["quantity_f"][i] + " " + visitor.wlk_ctx["entities"]["food"][i] + " and ";
        }
        for i = 0 to i < visitor.wlk_ctx["entities"]["quantity_d"].length by i+=1 {
            meal_string += visitor.wlk_ctx["entities"]["quantity_d"][i] + " " + visitor.wlk_ctx["entities"]["drink"][i];
        }
        visitor.response = "You had " + meal_string + ". Is that correct?";
    }
}

node meal_confirmed:dialogue_state{
    has name = "meal confirmed";
    can process {
        // record all data in database and update UI
    }
    can nlg {
        visitor.response = "Thank you! Your food and water intake have been updated. Have a healthy day!";
    }
}

node meal_canceled:dialogue_state{
    has name = "meal canceled";
    can nlg {
        visitor.response = "No worries! Your current meal recording session has been canceled.";
    }
}

edge entity_transition {
    has entities;
}

edge intent_transition {
    has intent;
}

graph haigiea_graph {
    has anchor dialogue_root;
    spawn {
        dialogue_root = spawn node::dialogue_root;
        record_drink = spawn node::record_drink;
        record_food = spawn node::record_food;
        follow_up = spawn node::follow_up;
        confirmation = spawn node::confirmation;
        meal_confirmed = spawn node::meal_confirmed;
        meal_canceled = spawn node::meal_canceled;

        // prompt user to say what they have eaten or drank today
        dialogue_root -[intent_transition(intent="record drink")]-> record_drink;
        dialogue_root -[intent_transition(intent="record food")]-> record_food;
        record_drink -[entity_transition(entities=["drink", "quantity_d"])]-> follow_up;
        record_drink -[intent_transition(intent="record drink or quantity_d")]-> record_drink;
        record_food -[entity_transition(entities=["food", "quantity_f"])]-> follow_up;
        record_food -[intent_transition(intent="record food or quantity_f")]-> record_food;
        follow_up -[intent_transition(intent="record drink")]-> record_drink;
        follow_up -[intent_transition(intent="record food")]-> record_food;
        follow_up -[intent_transition(intent="no")]-> confirmation;
        confirmation -[intent_transition(intent="yes")]-> meal_confirmed;
        confirmation -[intent_transition(intent="no")]-> dialogue_root; // maybe change_meal
        confirmation -[intent_transition(intent="cancel")]-> meal_canceled;
        // change_meal -[intent_transition(intent="record_drink")]-> record_drink; 
    }
}

walker talk {
    has question, interactive = true;
    has recorded_drink = false, recorded_food = false;
    has wlk_ctx = {
        "intent": null,
        "entities": {},
        "prev_state": null,
        "next_state": null,
        "respond": false
    };
    has response;
    root {
        take --> node::dialogue_root;
    }
    cai_state {
        if (!question and interactive) {
            question = std.input("Entry (Ctrl-C to exit)> "); // TODO: get input from STT module
            here::init_wlk_ctx;
        } elif (!question and !interactive){
            std.err("ERROR: question is required for non-interactive mode");
            disengage;
        }
        here::nlu;
        here::process;
        if (visitor.wlk_ctx["respond"]) {
            here::nlg;
            if (interactive): std.out(response);
            else {
                yield report response;
                here::init_wlk_ctx;
            }
            question = null;
            take here;
        } else {
            take visitor.wlk_ctx["next_state"] else: take here;
        }
    }
}

walker init {
    root {
        spawn here --> graph::haigiea_graph;
        spawn here walker::talk;
    }
}