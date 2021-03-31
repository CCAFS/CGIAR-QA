import {MigrationInterface, QueryRunner} from "typeorm"


export class updateIndicatorsMeta1617223303402 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("UPDATE qa_indicators_meta SET description = 'Does the case present significant quantitative progress against the 10 SLO targets from the CGIAR SRF and use appropriate metrics which correspond to a specific target (e.g. millions of hectares, millions of smallholder farmers, x% increased yield, etc.)If the results are updated from previous years, does the brief summary clearly indicates “updated results”? ' WHERE (id = '150')", undefined); ", undefined); 
        await queryRunner.query("UPDATE qa_indicators_meta SET description = 'Is the geographical scope, with precise location, clearly indicated? ' WHERE (id = '166')", undefined); 
        await queryRunner.query("INSERT INTO qa_indicators_meta (id, col_name, display_name, enable_comments, is_primay, include_general, include_detail, order, description, createdAt, updatedAt, indicatorId) VALUES ('166', 'geographic_scope', 'Geographic scope', '1', '0', '1', '1', '4', 'Is the geographical scope, with precise location, clearly indicated? ', '2021-03-30 10:09:22.534248', '2021-03-30 10:09:22.534248', '8')", undefined); 
        await queryRunner.query("INSERT INTO qa_indicators_meta (id, col_name, display_name, enable_comments, is_primay, include_general, include_detail, order, createdAt, updatedAt, indicatorId) VALUES ('167', 'countries', 'Country(ies)', '1', '0', '1', '1', '5', '2021-03-30 10:09:22.669333', '2021-03-30 10:09:22.669333', '8')", undefined); 
        await queryRunner.query("INSERT INTO qa_indicators_meta (id, col_name, display_name, enable_comments, is_primay, include_general, include_detail, order, createdAt, updatedAt, indicatorId) VALUES ('168', 'regions', 'Regions', '1', '0', '1', '1', '6', '2021-03-30 10:09:22.829465', '2021-03-30 10:09:22.829465', '8')", undefined); 
        
        
        await queryRunner.query("UPDATE qa_indicators_meta SET display_name = 'Link to OICR' WHERE (id = '66')", undefined); 
        await queryRunner.query("UPDATE qa_indicators_meta SET display_name = 'Related Innovation(s)' WHERE (id = '68')", undefined); 
        await queryRunner.query("UPDATE qa_indicators_meta SET display_name = 'Related Milestone(s)' WHERE (id = '67')", undefined); 
        await queryRunner.query("UPDATE qa_indicators_meta SET display_name = 'Contributing CRPs/Platforms' WHERE (id = '38')", undefined); 
        await queryRunner.query("UPDATE qa_indicators_meta SET display_name = 'Gender score' WHERE (id = '39')", undefined); 
        await queryRunner.query("UPDATE qa_indicators_meta SET display_name = 'Youth score' WHERE (id = '40')", undefined); 
        await queryRunner.query("UPDATE qa_indicators_meta SET display_name = 'CapDev score' WHERE (id = '41')", undefined); 
        await queryRunner.query("UPDATE qa_indicators_meta SET display_name = 'Climate Change score' WHERE (id = '42')", undefined); 
        await queryRunner.query("UPDATE qa_indicators_meta SET description = 'Is the title informative? Does it explain what the policy is about, who has implemented it and where it has been implemented?' WHERE (id = '30')", undefined); 
        await queryRunner.query("UPDATE qa_indicators_meta SET description = 'Is the description concise, clear, correctly matching the policy type and appropriate for a non-specialist audience?' WHERE (id = '31')", undefined); 
        await queryRunner.query("UPDATE qa_indicators_meta SET description = 'Has the reported item been appropriately reported as a policy, legal instrument, investment, or curriculum? ' WHERE (id = '34')", undefined); 
        await queryRunner.query("UPDATE qa_indicators_meta SET description = 'Does the level of maturity match the description?  ' WHERE (id = '35')", undefined); 
        await queryRunner.query("UPDATE qa_indicators_meta SET description = 'Does the attribution of the policy to a certain type of actors seem appropriate? (Funder, Public sector, Private sector, Other : please specify)' WHERE (id = '36')", undefined); 
        await queryRunner.query("UPDATE qa_indicators_meta SET description = 'Has narrative evidence been provided and supported by a link to evidence (for level 1)? Is there a link to an OICR (obligatory if level 2 or 3 please check the content)? ' WHERE (id = '164')", undefined); 
        await queryRunner.query("UPDATE qa_indicators_meta SET description = 'Do the sub-IDOs (max 2) seem appropriate? ' WHERE (id = '37')", undefined); 
        await queryRunner.query("UPDATE qa_indicators_meta SET description = 'Does the “geographic scope and location\" match the description?' WHERE (id = '43')", undefined); 
        await queryRunner.query("UPDATE qa_indicators_meta SET description = 'does the score match the description provided?' WHERE (id = '39')", undefined); 
        await queryRunner.query("UPDATE qa_indicators_meta SET description = 'does the score match the description provided?' WHERE (id = '40')", undefined); 
        await queryRunner.query("UPDATE qa_indicators_meta SET description = 'does the score match the description provided?' WHERE (id = '41')", undefined); 
        await queryRunner.query("UPDATE qa_indicators_meta SET description = 'does the score match the description provided?' WHERE (id = '42')", undefined); 
        
        
        
        await queryRunner.query("UPDATE qa_indicators_meta SET display_name = 'Innovation(s) or finding(s) that have resulted in this outcome or impact' WHERE (id = '161')", undefined); 
        await queryRunner.query("UPDATE qa_indicators_meta SET display_name = 'STATUS' WHERE (id = '75')", undefined); 
        await queryRunner.query("UPDATE qa_indicators_meta SET display_name = 'Related Policies' WHERE (id = '78')", undefined); 
        await queryRunner.query("UPDATE qa_indicators_meta SET display_name = 'Related Innovation(s)' WHERE (id = '88')", undefined); 
        await queryRunner.query("UPDATE qa_indicators_meta SET display_name = 'Related Milestone(s)' WHERE (id = '89')", undefined); 
        await queryRunner.query("UPDATE qa_indicators_meta SET display_name = 'Gender score' WHERE (id = '92')", undefined); 
        await queryRunner.query("UPDATE qa_indicators_meta SET display_name = 'Youth score' WHERE (id = '94')", undefined); 
        await queryRunner.query("UPDATE qa_indicators_meta SET display_name = 'Gender score justification' WHERE (id = '93')", undefined); 
        await queryRunner.query("UPDATE qa_indicators_meta SET display_name = 'Youth score justification' WHERE (id = '95')", undefined); 
        await queryRunner.query("UPDATE qa_indicators_meta SET display_name = 'CapDev score' WHERE (id = '96')", undefined); 
        await queryRunner.query("UPDATE qa_indicators_meta SET display_name = 'CapDev score justification' WHERE (id = '97')", undefined); 
        await queryRunner.query("UPDATE qa_indicators_meta SET display_name = 'Climate Change score' WHERE (id = '98')", undefined); 
        await queryRunner.query("UPDATE qa_indicators_meta SET display_name = 'Climate Change score justification' WHERE (id = '99')", undefined); 
        await queryRunner.query("UPDATE qa_indicators_meta SET display_name = 'CGIAR sub-IDOs' WHERE (id = '80')", undefined); 
        await queryRunner.query("UPDATE qa_indicators_meta SET description = 'Is the OICR title clear and, specific? Does it cover key points and not overclaim? ' WHERE (id = '73')", undefined); 
        await queryRunner.query("UPDATE qa_indicators_meta SET description = 'Is the described OICR status (new outcome, an updated case same level or an updated case new level) corresponding with the description in the “short outcome/impact statement” and the “elaboration of outcome/impact statement” (= Full statement)  ' WHERE (id = '75')", undefined); 
        await queryRunner.query("UPDATE qa_indicators_meta SET description = 'Is the reported item an outcome or impact case? (be sure it is not an activity, a study project, a funding or an output) ? Is the “short outcome/impact statement” clear, not overclaiming and aligned with both the “elaboration of outcome/impact statement = full statement” and the “outcome story for communication use” ? ' WHERE (id = '76')", undefined); 
        await queryRunner.query("UPDATE qa_indicators_meta SET description = 'Does the outcome story for communication use include the following elements : a) Short impact statement (brief description of the outcome’s contribution) and b) body (should summarize the outcome, describe the change and the role/contribution of the CGIAR Program/Center. References, statements, photos, videos are welcomed). ' WHERE (id = '77')", undefined); 
        await queryRunner.query("UPDATE qa_indicators_meta SET description = 'Does the “geographic scope and location\" match the description? (if at subnational level, the country must be specified).' WHERE (id = '82')", undefined); 
        await queryRunner.query("UPDATE qa_indicators_meta SET description = 'Is the stage of maturity appropriately defined (from stage 1 to 3)? ' WHERE (id = '79')", undefined); 
        await queryRunner.query("UPDATE qa_indicators_meta SET description = 'Are the sub-IDOs correctly applied?' WHERE (id = '80')", undefined); 
        await queryRunner.query("UPDATE qa_indicators_meta SET description = 'Do the selected SRF 2022/2030 targets match the description?' WHERE (id = '81')", undefined); 
        await queryRunner.query("UPDATE qa_indicators_meta SET description = 'Do the Milestones match the description? ' WHERE (id = '89')", undefined); 
        await queryRunner.query("UPDATE qa_indicators_meta SET description = 'Do the related policies match the description? ' WHERE (id = '78')", undefined); 
        await queryRunner.query("UPDATE qa_indicators_meta SET description = 'Do the related innovations match the description? ' WHERE (id = '88')", undefined); 
        await queryRunner.query("UPDATE qa_indicators_meta SET description = 'Does the elaboration of the Outcome/Impact (= full statement) provide relevant text to strengthen the contribution case, e.g. the rationale behind the outcome, quantified results, etc)? ' WHERE (id = '90')", undefined); 
        await queryRunner.query("UPDATE qa_indicators_meta SET description = 'Does the cross-cutting marker score match the justification provided?' WHERE (id = '92')", undefined); 
        await queryRunner.query("UPDATE qa_indicators_meta SET description = 'Does the cross-cutting marker score match the justification provided?' WHERE (id = '94')", undefined); 
        await queryRunner.query("UPDATE qa_indicators_meta SET description = 'Does the cross-cutting marker score match the justification provided?' WHERE (id = '96')", undefined); 
        await queryRunner.query("UPDATE qa_indicators_meta SET description = 'Does the cross-cutting marker score match the justification provided?' WHERE (id = '98')", undefined); 
        await queryRunner.query("UPDATE qa_indicators_meta SET description = 'Does the justification match the cross-cutting marker score?' WHERE (id = '93')", undefined); 
        await queryRunner.query("UPDATE qa_indicators_meta SET description = 'Does the justification match the cross-cutting marker score?' WHERE (id = '95')", undefined); 
        await queryRunner.query("UPDATE qa_indicators_meta SET description = 'Does the justification match the cross-cutting marker score?' WHERE (id = '97')", undefined); 
        await queryRunner.query("UPDATE qa_indicators_meta SET description = 'Does the justification match the cross-cutting marker score?' WHERE (id = '99')", undefined); 
        
        
        await queryRunner.query("UPDATE qa_indicators_meta SET display_name = 'Title' WHERE (id = '6')", undefined); 
        await queryRunner.query("UPDATE qa_indicators_meta SET display_name = 'Description' WHERE (id = '7')", undefined); 
        await queryRunner.query("UPDATE qa_indicators_meta SET display_name = 'Stage' WHERE (id = '9')", undefined); 
        await queryRunner.query("UPDATE qa_indicators_meta SET display_name = 'Description of Stage' WHERE (id = '10')", undefined); 
        await queryRunner.query("UPDATE qa_indicators_meta SET display_name = 'Type' WHERE (id = '11')", undefined); 
        await queryRunner.query("UPDATE qa_indicators_meta SET description = 'Is the title clear, informative, and focused on the innovation itself, in a straightforward manner? The title should highlight the actual findings / state the country / include the number of product(s)' WHERE (id = '6')", undefined); 
        await queryRunner.query("UPDATE qa_indicators_meta SET description = 'Is the description clear? it should: <br> a) Focus on the main finding(s)/innovative solution(s), how it works, and who are the target users. ' WHERE (id = '7')", undefined); 
        await queryRunner.query("UPDATE qa_indicators_meta SET description = 'Is the evidence provided supporting well the title and the description and strong enough to justify the chosen stage? ' WHERE (id = '22')", undefined); 
        await queryRunner.query("UPDATE qa_indicators_meta SET description = 'Is the described innovation classified at the right stage? ' WHERE (id = '9')", undefined); 
        await queryRunner.query("UPDATE qa_indicators_meta SET description = '' WHERE (id = '165')", undefined); 
        await queryRunner.query("UPDATE qa_indicators_meta SET description = 'Does the description of the stage match the selected stage?' WHERE (id = '10')", undefined); 
        await queryRunner.query("UPDATE qa_indicators_meta SET description = 'For genetic innovations: is the number of individual improved lines/varieties indicated and supported by evidence?  \r Normally, for stage 3 and 4, a single variety released in a single country is one innovation' WHERE (id = '12')", undefined); 
        await queryRunner.query("UPDATE qa_indicators_meta SET description = 'Is the described innovation well classified by type? ' WHERE (id = '11')", undefined); 
        await queryRunner.query("UPDATE qa_indicators_meta SET description = 'Is the geographic scope provided and appropriate? ' WHERE (id = '13')", undefined); 
        await queryRunner.query("UPDATE qa_indicators_meta SET description = 'Are the sub-IDOs correctly applied?' WHERE (id = '20')", undefined); 
        
        
        await queryRunner.query("UPDATE qa_indicators_meta SET display_name = 'CGIAR sub-IDOs' WHERE (id = '162')", undefined); 
        await queryRunner.query("UPDATE qa_indicators_meta SET display_name = 'Status description' WHERE (id = '132')", undefined); 
        await queryRunner.query("UPDATE qa_indicators_meta SET display_name = 'Gender score' WHERE (id = '135')", undefined); 
        await queryRunner.query("UPDATE qa_indicators_meta SET display_name = 'Gender score justification' WHERE (id = '136')", undefined); 
        await queryRunner.query("UPDATE qa_indicators_meta SET display_name = 'Youth score' WHERE (id = '137')", undefined); 
        await queryRunner.query("UPDATE qa_indicators_meta SET display_name = 'CapDev score' WHERE (id = '139')", undefined); 
        await queryRunner.query("UPDATE qa_indicators_meta SET display_name = 'CapDev score justification' WHERE (id = '140')", undefined); 
        await queryRunner.query("UPDATE qa_indicators_meta SET display_name = 'Climate Change score' WHERE (id = '141')", undefined); 
        await queryRunner.query("UPDATE qa_indicators_meta SET display_name = 'Climate Change score justification' WHERE (id = '142')", undefined); 
        await queryRunner.query("UPDATE qa_indicators_meta SET description = 'Are the sub-IDOs correctly applied?' WHERE (id = '162')", undefined); 
        await queryRunner.query("UPDATE qa_indicators_meta SET description = 'Does the description of summary progress against each FP outcome make sense to a non-specialist reader?' WHERE (id = '163')", undefined); 
        await queryRunner.query("UPDATE qa_indicators_meta SET description = 'For milestones statuses marked as “completed”, is/are there :<br> a) a credible explanation of progress, again for non-specialist readers?<br> b) reference(s) or link(s) provided with the explanation of progress?<br> For milestone statuses marked as “extended, cancelled or changed” is there an appropriate explanation?' WHERE (id = '131')", undefined); 
        await queryRunner.query("UPDATE qa_indicators_meta SET description = 'Does the evidence match the description?' WHERE (id = '133')", undefined); 
        await queryRunner.query("UPDATE qa_indicators_meta SET description = 'Does the link to evidence work ?' WHERE (id = '134')", undefined); 
        await queryRunner.query("UPDATE qa_indicators_meta SET description = 'Does the cross-cutting marker score match the justification provided?' WHERE (id = '135')", undefined); 
        await queryRunner.query("UPDATE qa_indicators_meta SET description = 'Does the justification match the cross-cutting marker score?' WHERE (id = '136')", undefined); 
        await queryRunner.query("UPDATE qa_indicators_meta SET description = 'Does the cross-cutting marker score match the justification provided?' WHERE (id = '137')", undefined); 
        await queryRunner.query("UPDATE qa_indicators_meta SET description = 'Does the justification match the cross-cutting marker score?' WHERE (id = '138')", undefined); 
        await queryRunner.query("UPDATE qa_indicators_meta SET description = 'Does the cross-cutting marker score match the justification provided?' WHERE (id = '139')", undefined); 
        await queryRunner.query("UPDATE qa_indicators_meta SET description = 'Does the justification match the cross-cutting marker score?' WHERE (id = '140')", undefined); 
        await queryRunner.query("UPDATE qa_indicators_meta SET description = 'Does the cross-cutting marker score match the justification provided?' WHERE (id = '141')", undefined); 
        await queryRunner.query("UPDATE qa_indicators_meta SET description = 'Does the justification match the cross-cutting marker score?' WHERE (id = '142')", undefined); 
        
        await queryRunner.query("UPDATE qa_indicators_meta SET description = 'Combine the \"Permanent identifier DOI or Handle\" + add the criteria \"Verifiy that the link is working\" ? ' WHERE (id = '62')", undefined); 
        await queryRunner.query("UPDATE qa_indicators_meta SET description = 'Combine with \"DOI\"' WHERE (id = '63')", undefined); 
        await queryRunner.query("UPDATE qa_indicators_meta SET description = 'The first available publications during the reporting year, online or printed, for which the article is available for wider audience (paid or open access). Only for the year the article was published for the first time. ' WHERE (id = '55')", undefined); 
        await queryRunner.query("UPDATE qa_indicators_meta SET description = '' WHERE (id = '54')", undefined); 
        await queryRunner.query("UPDATE qa_indicators_meta SET description = '' WHERE (id = '53')", undefined); 
        await queryRunner.query("UPDATE qa_indicators_meta SET description = '' WHERE (id = '56')", undefined); 
        await queryRunner.query("UPDATE qa_indicators_meta SET description = '' WHERE (id = '57')", undefined); 
        await queryRunner.query("UPDATE qa_indicators_meta SET description = '' WHERE (id = '58')", undefined); 
        await queryRunner.query("UPDATE qa_indicators_meta SET description = '' WHERE (id = '59')", undefined); 
        await queryRunner.query("UPDATE qa_indicators_meta SET description = '' WHERE (id = '60')", undefined); 
        await queryRunner.query("UPDATE qa_indicators_meta SET description = '' WHERE (id = '61')", undefined); 
        
        
        await queryRunner.query("UPDATE qa_indicators_meta SET display_name = 'Number of individual improved lines/varieties' WHERE (id = '12')", undefined); 
        await queryRunner.query("UPDATE qa_indicators_meta SET display_name = 'Number of long-term trainees (women)' WHERE (id = '116')", undefined); 
        await queryRunner.query("UPDATE qa_indicators_meta SET display_name = 'Number of long-term trainees (men)' WHERE (id = '117')", undefined); 
        await queryRunner.query("UPDATE qa_indicators_meta SET display_name = 'Number of PhD Trainees (women) (included into the long term trainees total)' WHERE (id = '118')", undefined); 
        await queryRunner.query("UPDATE qa_indicators_meta SET display_name = 'Number of PhD Trainees (men) (included into the long term trainees total)' WHERE (id = '119')", undefined); 
        await queryRunner.query("UPDATE qa_indicators_meta SET display_name = 'Number of short term trainees (women)' WHERE (id = '120')", undefined); 
        await queryRunner.query("UPDATE qa_indicators_meta SET display_name = 'Number of short term trainees (men)' WHERE (id = '121')", undefined); 
        await queryRunner.query("UPDATE qa_indicators SET qa_criteria = '<H5><a href=\"https://drive.google.com/file/d/1hTTfTVaI5vIeLlEaXNCfdZW5dAFonuND/view\" target=\"_blank\">See Capdev guidance</a> <br></H5><br>Do the indicated numbers seem reasonable for men vs women?<br> Do the indicated numbers seem reasonable for long vs short term? ' WHERE (id = '6')", undefined); 
        
        
        await queryRunner.query("UPDATE qa_indicators SET qa_criteria = '' WHERE (id = '7')", undefined); 
        await queryRunner.query("UPDATE qa_indicators SET qa_criteria = '' WHERE (id = '5')", undefined); 
        
        
        await queryRunner.query("UPDATE qa_indicators_meta SET description = 'Does the title match the type of activity/study selected and described?' WHERE (id = '107')", undefined); 
        await queryRunner.query("UPDATE qa_indicators_meta SET description = 'Is the type of activity/study described appropriately? Does it match  the dropdown list?' WHERE (id = '105')", undefined); 
        await queryRunner.query("UPDATE qa_indicators_meta SET description = 'For an activity/study status marked “completed”, is there a credible explanation of progress? For an activity/study status marked “extended, cancelled or changed”, is there an appropriate explanation?' WHERE (id = '104')", undefined); 
        await queryRunner.query("UPDATE qa_indicators_meta SET description = 'Does the short narrative included in the description of activity/study highlight clearly the key points of interest for a non-specialist reader?' WHERE (id = '108')", undefined); 
        await queryRunner.query("UPDATE qa_indicators_meta SET description = 'Are reference(s) or link(s) to MELIA publication provided? Does it make reference to progress or changes?' WHERE (id = '109')", undefined); 
        ", 
        undefined) 
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}
